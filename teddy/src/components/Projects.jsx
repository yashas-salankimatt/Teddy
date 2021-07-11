import React, { useEffect, useState } from 'react';
import { deleteProject, getCatDoc } from '../utils/FirestoreConfig';
import Tasks from './Tasks';
import EditCategoryPopup from './EditCategoryPopup';
import './Projects.css';


function Projects ({catID, deleteCatFunc}) {
    var currProjName = null;

    const [projects, setProjects] = useState([]);
    const [catDoc, setCatDoc] = useState(null);
    const [categoryName, setCatName] = useState("");
    const [projState, setProjState] = useState([]);
    const [showChildren, setShowChildren] = useState(false);
    const [showEditCatPopup, setShowEditPopup] = useState(false);

    // TODO IMPLEMENT CREATE PROJECT POPUP
    const createProj = ({projectName}) => {

    };

    const deleteProj = ({projectID=null, projectName=null}) => {
        deleteProject({catDoc, projectName, projectID}).then((retID) => {
            projectID = retID;
        });

        console.log(projects, projectID);
        var tempProjects = projects;
        const findInd = tempProjects.findIndex((element) => {
            return (element.projectID === projectID || element.projectName === projectName);
        });
        if (findInd >= 0){
            tempProjects.splice(findInd, 1);
        }
        setProjects(tempProjects);
        console.log(projects);
        setProjState(projects.map((proj) => proj.projectID));
    };

    useEffect(() => {
        // console.log("beginning");
        // projects = [];
        getCatDoc({categoryID: catID}).then((ret) => {
            setCatDoc(ret);
            // console.log(ret);
        });
        
    }, []);

    useEffect(() => {
        // projects = [];
        setProjects([]);
        // console.log("Reset projects");
        if (catDoc){
            catDoc.get().then((retDoc) => {
                setCatName(retDoc.data().categoryName);
                // console.log(retDoc.data());
            });
            async function fetchData() {
                try {
                    const snapshot = await catDoc.collection("projects").get();
                    if (snapshot.empty){
                        console.log("No projects for category " + categoryName);
                        return;
                    }
                    var tempProjects = projects;
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
                    setProjState(projects.map((proj) => proj.projectID));
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
    }

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
                <button className='DeleteButton btn btn-secondary' onClick={() => {deleteCatFunc({categoryID: catID})}}>Delete</button>
                <EditCategoryPopup trigger={showEditCatPopup} setTrig={setShowEditPopup} catDoc={catDoc}></EditCategoryPopup>
                {showChildren &&  <div>
                    <h5>Projects</h5>
                    <div className='CreateProjectWrapper'>
                        <form>
                            <input className='form-control' type='text' onChange={projectInputHandler} placeholder="Enter project name" name="projInput"></input>
                        </form>
                        <button className='btn btn-secondary m-1' onClick={() => {}}>
                            +
                        </button>
                        <button className='btn btn-secondary m-1' onClick={() => {}}>
                            -
                        </button>
                    </div>
                    <ul className='ProjectsList'>
                        {projState.map((element) => (
                            // <li key={element}>{element}</li>
                            <Tasks catID={catID} projID={element} deleteProjFunction={deleteProj} key={element}></Tasks>
                        ))}
                    </ul>
                </div>}
            </li>}
        </div>
    );
}

export default Projects;