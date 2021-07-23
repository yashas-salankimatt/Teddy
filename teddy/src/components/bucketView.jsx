import React from 'react';
import Categories from './Categories';
import './Categories.css';

function BucketView(props) {
    return (
        <div className='ScrollView'>
            <Categories></Categories>
        </div>
    );
}

export default BucketView;