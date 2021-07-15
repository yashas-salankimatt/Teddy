import React, { useEffect, useState } from 'react';
import { deleteProject, createProject} from '../utils/TaskDBConfig';
import Tasks from './Tasks';
import EditCategoryPopup from './EditCategoryPopup';
import CreateProjectPopup from './CreateProjectPopup';
import './Projects.css';
import DropDownIcon from '../icons/caret-right-fill.svg';


function Projects ({catData, deleteCatFunc}) {
    const [projects, setProjects] = useState([]);
    const [catDoc, setCatDoc] = useState(null);
    const [categoryName, setCatName] = useState("");
    // const [projState, setProjState] = useState([]);
    const [showChildren, setShowChildren] = useState(false);
    const [showEditCatPopup, setShowEditPopup] = useState(false);
    const [showCreateProjPopup, setCreateProjPopup] = useState(false);

    
    const createProj = ({newProjData}) => {
        createProject({
            projectName: newProjData.projectName,
            dueDate: newProjData.dueDate,
            catDoc: catDoc,
            description: newProjData.description,
            completed: newProjData.completed
        }).then(async (projRef) => {
            if (projRef){
                var tempProjects = projects.concat();
                // console.log(tempProjects);
                tempProjects.push({
                    projectID: projRef.id,
                    projDoc: projRef,
                    projectName: newProjData.projectName,
                    dueDate: newProjData.dueDate,
                    description: newProjData.description,
                    completed: newProjData.completed
                });
                setProjects(tempProjects);
            }
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
        setProjects([]);
        setCatDoc(catData.element.catDoc);
        setCatName(catData.element.categoryName);
    }, []);

    // useEffect(() => {
    //     setProjects([]);
    //     setCatDoc(catData.element.catDoc);
    //     setCatName(catData.element.categoryName);
    // }, [catData]);

    useEffect(() => {
        setProjects([]);
        setCatDoc(catData.element.catDoc);
        setCatName(catData.element.categoryName);
        if (catDoc){
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
                } catch (error) {
                    console.log("Error in trying to get projects for category " + categoryName);
                    console.log(error);
                }
            }
            fetchData();
        }
    }, [catDoc, catData]);

    useEffect(() => {
        var newProjects = [];
        var diff = false;
        projects.forEach((project) => {
            var found = false;
            newProjects.forEach((newProj) => {
                if (newProj.projectID === project.projectID){
                    found = true;
                    diff = true;
                }
            });
            if (!found) {
                newProjects.push(project);
            }
        });
        if (diff){
            setProjects(newProjects);
        }
    }, [projects]);

    function updateCatData ({newCatData}) {
        setCatName(newCatData.categoryName);
        catData.element.categoryName = newCatData.categoryName;
        catData.element.archived = newCatData.archived;
    };

    // TODO:
    // - Add checkboxes to the projects list view- this is most likely going to be in the tasks.jsx file though
    // - Add date due view to the projects list view- this is also most likely going to be in the tasks.jsx file
    return (
        <div key={catData.element.categoryID}>
            {catDoc && <div className='CategoryItem'>
                <div>
                    <img className={"DropDownIcon " + (showChildren ? 'active' : '')} src={DropDownIcon} onClick={() => {setShowChildren(!showChildren)}} alt=">"/>
                </div>
                <div className='CategoryListItem' key={catDoc.id}>
                    {categoryName}
                    <EditCategoryPopup trigger={showEditCatPopup} setTrig={setShowEditPopup} catData={catData} updateParentData={updateCatData}></EditCategoryPopup>
                    {showChildren &&  <div>
                        <div className='CreateProjectWrapper'>
                            <CreateProjectPopup trigger={showCreateProjPopup} setTrig={setCreateProjPopup} updateParentData={createProj}></CreateProjectPopup>
                            <h4 className='m-2'>Projects</h4>
                            <button className='btn btn-secondary m-1' onClick={() => {setCreateProjPopup(true)}}>Create Project</button>
                        </div>
                        <ul className='ProjectsList' key={catData.element.categoryID}>
                            {projects.map((element, index) => (
                                <Tasks projData={{element}} deleteProjFunction={deleteProj} key={index}></Tasks>
                            ))}
                        </ul>
                    </div>}
                </div>
                <button className='EditButton btn btn-secondary' onClick={() => {setShowEditPopup(true)}}>Edit</button>
                <button className='DeleteButton btn btn-secondary' onClick={() => {deleteCatFunc({categoryID: catDoc.id})}}>Delete</button>
            </div>}
        </div>
    );
}

export default Projects;