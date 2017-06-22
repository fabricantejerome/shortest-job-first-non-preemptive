"use strict";

class JobsFinish extends Jobs {

	// Display the Jobs attribute
	displayJobs() {
		let table_content = '';

		for (let [index, value] of this.data.entries()) {
			table_content = table_content + `<tr data-index=${index} >
							<td> ${value.job} </td>
							<td> ${value.arrival} </td> 
							<td> ${value.burst}</td>
							<td> ${value.waiting}</td>
							<td> ${value.finish}</td>
							</tr>`;
		}

		return table_content;
	}

}
