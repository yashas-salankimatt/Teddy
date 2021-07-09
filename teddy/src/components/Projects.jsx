import React, { useEffect, useState } from 'react';
import { getCatDoc } from '../utils/FirestoreConfig';

function Projects ({catID}) {
    const [catDoc, setCatDoc] = useState(null);
    const [categoryName, setCatName] = useState("");

    useEffect(() => {
        getCatDoc({categoryID: catID}).then((ret) => {
            setCatDoc(ret);
            console.log("Finished");
            console.log(ret);
        });
    }, []);

    useEffect(() => {
        if (catDoc){
            catDoc.get().then((retDoc) => {
                setCatName(retDoc.data().categoryName);
                console.log(retDoc.data());
            });
        }
    }, [catDoc]);

    return (
        <div>
            {catDoc && <li key={catDoc.id}>
                {categoryName}
            </li>}
        </div>
    );
}

export default Projects;