import React, { Component } from "react";
import CKEditor from 'react-ckeditor-component';

class ReactCkeditor extends Component {
    constructor(props) {
        super(props);
        this.componentDidMount = this.componentDidMount.bind(this);
    }


    render() {
        return (
            <textarea name="editor" cols="100" rows="6" defaultValue={this.props.value}></textarea>
        )
    }

    
    componentDidMount() {
        console.log(CKEDITOR.replace);
        CKEDITOR.replace("editor");
        // let configuration = {
        //     toolbar: "Basic"
        // };
        // CKEDITOR.replace("editor", configuration);
        // CKEDITOR.instances.editor.on('change', function () {
        //     let data = CKEDITOR.instances.editor.getData();
        //     this.props.onChange(data);
        // }.bind(this));
    }
}

export default ReactCkeditor;
