"use strict";

class Jobs {
	// Call the constructor with empty data
	constructor(data = []) {
		this.data = [];
	}

	// Add jobs when the user click add Job
	appendJob(job = [{}]) {
		this.data.push(...job);
	}

	// Get the current number of jobs
	jobCount() {
		return this.data.length;
	}

	// Display the Jobs attribute
	displayJobs() {
		let table_content = '';

		for (let [index, value] of this.data.entries()) {
			table_content = table_content + `<tr data-index=${index} >
							<td> ${value.job} </td>
							<td> ${value.arrival} </td> 
							<td> ${value.burst}</td>
							</tr>`;
		}

		return table_content;
		
	}

	// Remove the Jobs
	removeJob(index) {
		return this.data.splice(index, 1);
	}
}