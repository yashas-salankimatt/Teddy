import React, { useEffect, useState } from 'react';
import { deleteProject, createProject} from '../utils/FirestoreConfig';
import Tasks from './Tasks';
import EditCategoryPopup from './EditCategoryPopup';
import CreateProjectPopup from './CreateProjectPopup';
import './Projects.css';


function Projects ({catData, deleteCatFunc}) {
    // console.log(catData);
    var currProjName = null;

    const [projects, setProjects] = useState([]);
    const [catDoc, setCatDoc] = useState(null);
    const [categoryName, setCatName] = useState("");
    // const [projState, setProjState] = useState([]);
    const [showChildren, setShowChildren] = useState(false);
    const [showEditCatPopup, setShowEditPopup] = useState(false);
    const [showCreateProjPopup, setCreateProjPopup] = useState(false);

    // TODO IMPLEMENT CREATE PROJECT POPUP
    const createProj = ({newProjData}) => {
        console.log(newProjData);
        createProject({
            projectName: newProjData.projectName,
            dueDate: newProjData.dueDate,
            catDoc: catDoc,
            description: newProjData.description,
            completed: newProjData.completed
        }).then((projRef) => {
            var tempProjects = projects.concat();
            console.log(tempProjects);
            tempProjects.push({
                projectID: projRef.id,
                projDoc: projRef,
                projectName: newProjData.projectName,
                dueDate: newProjData.dueDate,
                description: newProjData.description,
                completed: newProjData.completed
            });
            console.log(tempProjects);
            setProjects(tempProjects);
        });

    };

    const deleteProj = ({projectID=null, projectName=null}) => {
        deleteProject({catDoc, projectName, projectID}).then((retID) => {
            projectID = retID;
        });

        // console.log(projects, projectID);
        var tempProjects = projects.concat();
        const findInd = tempProjects.findIndex((element) => {
            return (element.projectID === projectID || element.projectName === projectName);
        });
        if (findInd >= 0){
            tempProjects.splice(findInd, 1);
        }
        setProjects(tempProjects);
        // console.log(projects);
        // setProjState(projects.map((proj) => proj.projectID));
    };

    useEffect(() => {
        setCatDoc(catData.element.catDoc);
        setCatName(catData.element.categoryName);
    }, []);

    useEffect(() => {
        setCatDoc(catData.element.catDoc);
        setCatName(catData.element.categoryName);
    }, [catData]);

    useEffect(() => {
        // projects = [];
        setProjects([]);
        // console.log("Reset projects");
        if (catDoc){
            // catDoc.get().then((retDoc) => {
            //     setCatName(retDoc.data().categoryName);
            //     // console.log(retDoc.data());
            // });
            async function fetchData() {
                try {
                    const snapshot = await catDoc.collection("projects").get();
                    if (snapshot.empty){
                        console.log("No projects for category " + categoryName);
                        return;
                    }
                    var tempProjects = projects.concat();
                    snapshot.forEach((proj) => {
                        tempProjects.push({
                            projectID: proj.id,
                            projDoc: proj.ref,
                            projectName: proj.data().projectName,
                            description: proj.data().description,
                            completed: proj.data().completed,
                            dueDate: proj.data().dueDate
                        });
                    });
                    setProjects(tempProjects);
                    // setProjState(projects.map((proj) => proj.projectID));
                } catch (error) {
                    console.log("Error in trying to get projects for category " + categoryName);
                    console.log(error);
                }
            }
            fetchData();
        }
    }, [catDoc]);

    // useEffect(() => {
    //     console.log(projects);
    //     console.log(projState);
    // }, [projState]);

    const projectInputHandler = (event) => {
        currProjName = event.target.value;
    };

    function updateCatData ({newCatData}) {
        setCatName(newCatData.categoryName);
        catData.element.categoryName = newCatData.categoryName;
        catData.element.archived = newCatData.archived;
    };

    // TODO:
    // - Add checkboxes to the projects list view- this is most likely going to be in the tasks.jsx file though
    // - Add date due view to the projects list view- this is also most likely going to be in the tasks.jsx file
    return (
        <div className='CategoryItem'>
            {catDoc && <li className='CategoryListItem' key={catDoc.id}>
                {categoryName}
                <button className='EditButton btn btn-secondary' onClick={() => {
                    setShowChildren(!showChildren);
                }}>Show/Hide Projects</button>
                <button className='EditButton btn btn-secondary' onClick={() => {setShowEditPopup(true)}}>Edit</button>
                <button className='DeleteButton btn btn-secondary' onClick={() => {deleteCatFunc({categoryID: catDoc.id})}}>Delete</button>
                <EditCategoryPopup trigger={showEditCatPopup} setTrig={setShowEditPopup} catData={catData} updateParentData={updateCatData}></EditCategoryPopup>
                <CreateProjectPopup trigger={showCreateProjPopup} setTrig={setCreateProjPopup} updateParentData={createProj}></CreateProjectPopup>
                {showChildren &&  <div>
                    <div className='CreateProjectWrapper'>
                        <h4 className='m-2'>Projects</h4>
                        <button className='btn btn-secondary m-1' onClick={() => {setCreateProjPopup(true)}}>Create Project</button>
                        
                    </div>
                    <ul className='ProjectsList'>
                        {projects.map((element) => (
                            // <li key={element}>{element}</li>
                            <Tasks projData={{element}} deleteProjFunction={deleteProj} key={element.projectID}></Tasks>
                        ))}
                    </ul>
                </div>}
            </li>}
        </div>
    );
}

export default Projects;