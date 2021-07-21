import React, { useState } from 'react';
import Categories from './Categories';
import './Categories.css';
import ListView from './ListView';

function BucketView(props) {
    const [viewCat, setViewCat] = useState(true);

    return (
        <div style={{height: '96%'}}>
            <div className='btn-group' style={{border:'solid', borderRadius:'7.5px', borderColor:'gray'}} role='group'>
                <button className={'btn btn-' + (viewCat ? 'secondary':'light')} onClick={() => {setViewCat(true)}}>Category View</button>
                <button className={'btn btn-' + (!viewCat ? 'secondary':'light')} onClick={() => {setViewCat(false)}}>List View</button>
            </div>
            <div className='ScrollView'>
                {viewCat && <Categories/>}
                {!viewCat && <ListView/>}
            </div>
        </div>
    );
}

export default BucketView;