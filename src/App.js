import React, { Component } from 'react';
import './App.css';
import Tesseract from 'tesseract.js';
//var Tesseract = require('tesseract.js') //window.Tesseract;

class App extends Component {

  constructor(props) {
    super(props)
    this.state = {
      uploads: [],
      documents: [],
      user : []
    };
  }

  changeStringToWordArray = (text) => {
    let word = "";
    let arr = []
    //console.log(text);
    for (let i = 0; i < text.length; i++) {
      if (text[i] == " " || text[i] == '\n') {
        if (word != "") {
          arr.push(word)
          word = ""
        }
      }
      else word += text[i]
    }
    return arr
  }
  extractAlgorithm = (text) => {
    let list = ['Name', 'Age', 'Sex', 'Birthday', 'Blood', 'Group', 'Haemoglobin', 'Bilirubin', 'Riboflavin', 'Cobalamin', 'Riboflavin', 'Cobalamin'];
    let arr = this.changeStringToWordArray(text)
    let user = [], title = "", value = "", isInserted = "";
    for (let i  = 0; i < arr.length; i++) {
      let word = arr[i], isTitle = 0;
      if (word == ':') continue;
      for (let j = 0; j < list.length; j++) {
        if (word == list[j]) {
          if (title != "" && value != "") {
            user.push(<div>{title + " :"}     {value}</div>)
            title = ""
            value = ""
            isInserted = 1;
          }
          isTitle = 1;
          if (title != "") title += " "
          title += word;
          value = "";
          break;
        }
      }
      if (isTitle == 1) continue;
      value += " "
      value += word
      console.log(title + " " + word);
    } 
    user.push(<div>{title + " :"}     {value}</div>)
    this.setState({
      user : user
    })
    console.log(user);
  }

  handleChange = (event) => {
    if (event.target.files[0]) {
      var uploads = []
      console.log(event.target.files.key);

      for (let key in event.target.files) {
        if (!event.target.files.hasOwnProperty(key)) continue;
        let upload = event.target.files[key]
        uploads.push(URL.createObjectURL(upload))
      }
      this.setState({
        uploads: uploads
      })
    } else {
      this.setState({
        uploads: []
      })
    }
  }


  generateText = () => {
    let uploads = this.state.uploads
    console.log("working");

    for(let i = 0; i < uploads.length; i++) {
      Tesseract.recognize(uploads[i], 'eng')
      .catch(err => {
        console.error(err)
      })
      .then(result => {
        let confidence = result.data.confidence
  
        // full output
        let text = result.data.text
        this.extractAlgorithm(text);
        this.setState({ 
          documents: this.state.documents.concat({
            text: text,
            confidence: confidence
          })
        })
      })
    }
  }
  render() {
    return (
      <div className="app">
        <header className="header">
          <h1>PROTOTYPE</h1>
        </header>

        { /* Image uploader */ }
        <section className="hero">
          <label className="fileUploaderContainer">
            Click here to upload image
            <input type="file" id="fileUploader" onChange={this.handleChange} multiple />
          </label>
          <div>
            { this.state.uploads.map((value, index) => {
              return <img key={index} src={value} width="100px" />
            }) }
          </div>
          <button onClick={this.generateText} className="button">Extract text</button>
        </section>

        { /* Results */ }
        <section className="results">
          { this.state.documents.map((value, index) => {
            return (
              <div key={index} className="results__result">
                <div className="results__result__image">
                  <img src={this.state.uploads[index]} width="250px" />
                </div>
                <div className="results__result__info">
                  <div className="results__result__info__codes">
                    <small><strong>Confidence Score:</strong> {value.confidence}</small>
                  </div>
                  <div className="results__result__info__codes">
                    <small>{/*<strong>Pattern Output:</strong> {value.pattern.map((pattern) => { return pattern + ', ' })}*/}</small>
                  </div>
                  <div className="results__result__info__text">
                    <small><strong>OCR Output</strong> {value.text}</small>
                  </div>
                </div>
              </div>
              )
            }) 
          }
        </section>
        <div className="user-report">{this.state.user}</div>
      </div>
    )
  }

}

export default App;
