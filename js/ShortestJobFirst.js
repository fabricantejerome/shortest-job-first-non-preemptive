"use strict";

class ShortestJobFirst {

	constructor(job_list, job_finish, current_job, ready_queue, table_content) {
		this.job_list      = job_list;
		this.job_finish    = job_finish;
		this.current_job   = current_job;
		this.ready_queue   = ready_queue;
		this.table_content = table_content;
		this.state;
		this.callback;
	}

	filterData(job, arrival, burst) {
		if ( !job || !arrival || !burst ){
			console.log("Insufficient Data");
			return;
		}

		if ((job < 0) || (arrival < 0) || (burst < 0)) {
			console.log("Negative value is not allowed");
			return;
		}		

		this.job     = isNaN(job) ? Number(job) : job;
		this.arrival = isNaN(arrival) ? Number(arrival) : arrival;
		this.burst   = isNaN(burst) ? Number(burst) : burst;

		return this;
	}

	dataFormat() {
		return [{job: this.job, arrival: this.arrival, burst: this.burst}];
	}

	addJob(j, a, b) {
		this.filterData(j, a, b);
		this.job_list.appendJob(this.dataFormat());
	}

	displayTable() {
		if (this.job_list.jobCount()) {
			return this.job_list.displayJobs();
		}
	}

	startExecution($display, $canvas, $waiting_time) {
		if (this.job_list.jobCount()) {
			let seconds = 0;
			let span    = 1;
			let self    = this;
			let r_index;

			const colors = ['#561115', '#f9024d', '#bbaaee', '#727066', '#8b9dc3', '#3b5998', '#6565b3', '#422442', '#590a03', '#630c04', '#6e0e05', '#7b1006', '#891207', '#991508', '#ab1809', '#be1b0b', '#babdc1', '#515862', '#0c244c', '#0f52ba', '#d41f0d', '#51002b', '#ffca04', '#b6b4aa', '#a8ad9f', '#64675f', '#8fa0a7', '#bababa', '#800080', '#3366cc', '#339933', '#333399', '#336699', '#249324', '#4879aa', '#3454ab', '#242493', '#00ecff', '#00ff04', '#fff400', '#ff7400', '#ff0000'];
			
			function loop() {
				self.state = setTimeout(self.callback = function () {
					for (let [index, value] of self.job_list.data.entries()) {
						let { job, arrival, burst } = self.job_list.data[index];

						// Add the job to the ready queue
						if (arrival <= seconds) {
							self.transferJob(self.job_list, self.ready_queue, index);
						}
					}

					// Assign a job to be executed
					if (!self.current_job.jobCount() && self.ready_queue.jobCount()) {
						const shortestJob = self.getShortestBurst(self.ready_queue);
						self.current_job.appendJob(shortestJob);
						r_index = Math.floor((Math.random() * 41) + 1);
					}

					// Job does not arrive yet 
					if (!self.ready_queue.jobCount() && !self.current_job.jobCount()) {
						$canvas.append(`<div class='time_wrapper'><button class='btn btn-default' style='border-radius: 0;'>Idle</button><div class='time'>${seconds}</div></div>`);
					}

					// reduce the burst time of the current job
					if (self.current_job.jobCount()) {
						$canvas.append(`<div class='time_wrapper'><button class='btn btn-default' style='background: ${colors[r_index]}; border-radius: 0; color: white'>J${self.current_job.data[0].job}</button><div class='time'>${seconds}</div></div>`);
						
						if (span == self.current_job.data[0].burst) {
							let { job, arrival, burst } = self.current_job.data[0];
							const finish                = seconds + 1;
							const w                     = finish - arrival - burst;
					
							self.job_finish.appendJob([{job: job, arrival: arrival, burst: burst, waiting: w, finish: finish}]);
							self.current_job.removeJob(0);
							span = 1; 
						}
						else {
							span++;
						}
					}

					$display.html(`Time: ${seconds}`);
					seconds++;

					if (self.job_list.jobCount() || self.ready_queue.jobCount() || self.current_job.jobCount()) {
						loop();
					}
					else {
						self.job_finish.data.sort(self.by('job'));
						self.table_content.html(self.job_finish.displayJobs());
						$waiting_time.html(`Average WT: ${self.calculateAverage().toFixed(2)}`);

						$('#pause-button').hide();
						self.job_finish.data = [];
					}
				}, 1000)

			}

			loop();

		}
	}

	transferJob(src, dest, index) {
		dest.appendJob(src.removeJob(index));
	}

	getShortestBurst(rq) {
		if (rq instanceof Jobs) {

			rq.data.sort(this.by('job'));
			rq.data.sort(this.by('burst'));

			return rq.removeJob(0);
		}
	}

	calculateAverage() {
		let sum = 0;
		for (let[index, value] of this.job_finish.data.entries()) {
			sum = sum + value.waiting;
		}

		return sum / this.job_finish.jobCount();
	}

	by(name) {
		return (o, p) => {
			let a, b;

			if (typeof o === 'object' && typeof p === 'object' && o && p ) {
				a = o[name];
				b = p[name];

				if (a === b) {
					return 0;
				}

				if (typeof a === typeof b) {
					return a < b ? -1 : 1;
				}

				return typeof a < typeof b ? -1 : 1;
			}
			else {
				throw {
					name: 'Error',
					message: 'Expected an object when sorting by name' + name
				}
			}
		};
	}
}