"use strict";

class ShortestJobFirst {

	constructor(job_list, job_finish, current_job, ready_queue) {
		this.job_list      = job_list;
		this.job_finish    = job_finish;
		this.current_job   = current_job;
		this.ready_queue   = ready_queue;
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

	startExecution($display, $canvas) {
		if (this.job_list.jobCount()) {
			let seconds = 0;
			let span    = 1;
			
			while (this.job_list.jobCount() || this.ready_queue.jobCount() || this.current_job.jobCount()) { 
			//while (this.job_list.jobCount()) {
			//for (let seconds = 0; (this.job_list.jobCount() || this.ready_queue.jobCount() || this.current_job.jobCount()); seconds++ ) {
				//setTimeout(() => {
					for (let [index, value] of this.job_list.data.entries()) {
						let { job, arrival, burst } = this.job_list.data[index];

						// Add the job to the ready queue
						if (arrival <= seconds) {
							this.transferJob(this.job_list, this.ready_queue, index);
						}
					}

					// Assign a job to be executed
					if (!this.current_job.jobCount() && this.ready_queue.jobCount()) {
						const shortestJob = this.getShortestBurst(this.ready_queue);
						this.current_job.appendJob(shortestJob);
					}

					// Job does not arrive yet 
					if (!this.ready_queue.jobCount() && !this.current_job.jobCount()) {
						$canvas.append('<button class="btn btn-default">Idle</button>')
					}

					// reduce the burst time of the current job
					if (this.current_job.jobCount()) {
						$canvas.append(`<button class='btn btn-primary' style='background: green; border: none'>J${this.current_job.data[0].job}</button>`);
						
						if (span == this.current_job.data[0].burst) {
							let { job, arrival, burst } = this.current_job.data[0];
							const finish = seconds + 1;
							const w = finish - arrival - burst;
					
							this.job_finish.appendJob([{job: job, arrival: arrival, burst: burst, waiting: w, finish: finish}]);
							this.current_job.removeJob(0);
							span = 1;
						}
						else {
							span++;
						}
					}

				//}, 1000 * seconds);
				
				seconds++;
			}

			console.log(this.ready_queue);
			console.log(this.current_job);
			console.log(this.job_finish);
			$display.html(seconds);

			//console.log(this.job_list.data[0]);
			/*for (let i = 0; i < 20; i++) {
				setTimeout(() => {
					$display.html(i);
					$canvas.append(`<span> ${i} </span>`).css('color', 'red');
				}, 1000 * i);
			}*/
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