import React from 'react';
import './AppForm.css'
export default () => {
	let state
	const handleChange = (e) => {
	state =	{
			selectedFile: e.target.files[0],
		}

	}
	const uploadFile = (e) => {
		e.preventDefault();
		const data = new FormData();
		console.log(state.selectedFile)
		data.append('file',state.selectedFile)
		fetch('http://localhost:3010/upload', {
			method: 'POST',
			body: data,
		})
		.then(response => response.text())
		.then(() => {
			 const uploaded = document.getElementById('loaded')
			 uploaded.style.display = 'block';
		})
		.catch(error => {
			const uploaded = document.getElementById('loaded')
			uploaded.style.display = 'block';
			uploaded.innerText = `upload failed ERROR ${error}`
			console.error('Error:', error);
		});

	}
  return(
  		<div id="AppForm">
				<form>
					<input accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel" onChange={handleChange} id="uploadButton" type="file" ></input>
					<input onClick={uploadFile} id="uploadButton" type="submit"  ></input>
				</form>
				<p id="loaded">Upload Successful</p>
			</div>
	)
}
