<script lang="ts">
	/**
	 * INSTALL
	 * yarn add dayjs
	 *
	 * USAGE
	 * import DatePicker from './DatePicker.svelte'
	 * function datepicked (e) { console.log(e.detail.datepicked) }
	 *
	 * <DatePicker
	 *  on:datepicked={datepicked}
	 *  customclass=""                  (facultative) css class
	 * />
	 */

	import { createEventDispatcher, onMount } from 'svelte';
	import dayjs from 'dayjs';
	import 'dayjs/locale/pt';

	// data
	const dispatch = createEventDispatcher();
	let elModal: HTMLElement; // HTMLElement
	export let inputTxt: string; // string, défault date = now
	let isOpenCalendar: boolean = false; // true: show calendar
	const arrDays: string[] = ['2ª', '3ª', '4ª', '5ª', '6ª', 'Sa', 'Do']; // days of week

	const currentDay = +dayjs().format('D'); // 1..31
	const currentMonth = +dayjs().format('M'); // 1..12
	const currentYear = +dayjs().format('YYYY'); // 2021...
	let selectedMonth = inputTxt ? +inputTxt.split('-')[1] : +dayjs().format('M'); // 1..12
	let selectedYear = inputTxt ? +inputTxt.split('-')[0] : +dayjs().format('YYYY'); // 2021...
	let rows = initRows();

	// reactivity, on inputTxt changes
	$: {
		dispatch('datepicked', inputTxt);
	}

	// life cycle
	onMount(() => {
		dayjs.locale('pt');
		affecteRows();
	});

	// functions
	/**
	 * Click outside of the modal will close it
	 * @param e
	 */
	function handleClickModal(e: Event) {
		if (!e.target) return;
		if ((e.target as HTMLElement).id === 'calendar-modal') {
			isOpenCalendar = false;
		}
	}

	function initRows() {
		return [
			[0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0]
		];
	}

	function affecteRows() {
		rows = initRows();

		const firstDayOfCurrentMonth = ucFirst(
			dayjs(selectedYear + '-' + selectedMonth)
				.startOf('month')
				.format('dd')
		); // '3º'

		const lastDayOfCurrentMonth = +dayjs(selectedYear + '-' + selectedMonth)
			.endOf('month')
			.format('D'); // 31
		let iRow = 0;
		let iCol = 0;
		let start = false;
		let cpt = 0;
		for (iRow = 0; iRow < 6; iRow++) {
			arrDays.forEach((daystr) => {
				if (cpt > lastDayOfCurrentMonth) {
					return;
				}
				if (!start && daystr === firstDayOfCurrentMonth) {
					cpt++;

					start = true;
				}
				rows[iRow][iCol] = cpt;
				iCol++;
				if (start) {
					cpt++;
				}
			});
			iCol = 0;
		}
	}

	function ucFirst(str: string) {
		return str.charAt(0).toUpperCase() + str.slice(1);
	}

	function previousMonth() {
		selectedMonth--;
		if (selectedMonth <= 0) {
			selectedMonth = 12;
			selectedYear--;
		}
		affecteRows();
	}

	function nextMonth() {
		selectedMonth++;
		if (selectedMonth > 12) {
			selectedMonth = 1;
			selectedYear++;
		}
		affecteRows();
	}

	function selectDate(y: string | number, m: string | number, d: string | number) {
		inputTxt = dayjs(y + '-' + m + '-' + d).format('YYYY-MM-DD');
		isOpenCalendar = false;
	}
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
{#if isOpenCalendar}
	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<div
		id="calendar-modal"
		class="fixed z-40 left-0 top-0 w-full h-full overflow-auto bg-black bg-opacity-40 "
		bind:this={elModal}
		on:click={handleClickModal}
	>
		
		<div class="flex items-center justify-center py-8 px-4 my-auto">
			
			<div class="max-w-sm w-full shadow-lg">
				<div class="md:p-8 p-5 dark:bg-gray-800 bg-white rounded-t relative">
					<button class="absolute top-0 right-0 p-4 close" on:click={() => (isOpenCalendar = false)}>
		
					</button>
					<div class="px-4 flex items-center justify-start space-x-4">
						
						 <!-- bnt previous -->
						 <button
						 type="button"
						 on:click={previousMonth}
						 aria-label="calendar backward"
						 class="text-gray-800"
					 >
						 <svg
							 xmlns="http://www.w3.org/2000/svg"
							 class="icon icon-tabler icon-tabler-chevron-left"
							 width="24"
							 height="24"
							 viewBox="0 0 24 24"
							 stroke-width="1.5"
							 stroke="currentColor"
							 fill="none"
							 stroke-linecap="round"
							 stroke-linejoin="round"
						 >
							 <path stroke="none" d="M0 0h24v24H0z" fill="none" />
							 <polyline points="15 6 9 12 15 18" />
						 </svg>
					 </button>
						<span class="focus:outline-none text-base font-bold text-gray-800"
							>{ucFirst(dayjs(selectedYear + '-' + selectedMonth).format('MMMM YYYY'))}</span
						>
							<!-- bnt next -->
							<button
								type="button"
								on:click={nextMonth}
								aria-label="calendar forward"
								class="text-gray-800"
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									class="icon icon-tabler icon-tabler-chevron-right"
									width="24"
									height="24"
									viewBox="0 0 24 24"
									stroke-width="1.5"
									stroke="currentColor"
									fill="none"
									stroke-linecap="round"
									stroke-linejoin="round"
								>
									<path stroke="none" d="M0 0h24v24H0z" fill="none" />
									<polyline points="9 6 15 12 9 18" />
								</svg>
							</button>
						
					</div>
					<div class="flex items-center justify-between pt-12 overflow-x-auto">
						<table class="w-full">
							<thead>
								<tr>
									{#each arrDays as day}
										<th>
											<div class="w-full flex justify-center">
												<p class="text-base font-medium text-center text-gray-800">
													{day}
												</p>
											</div>
										</th>
									{/each}
								</tr>
							</thead>
							<tbody>
								{#each rows as col}
									<tr>
										{#each col as i}
											<td class="pt-4">
												<div class="px-2 py-2 cursor-pointer flex w-full justify-center">
													{#if i > 0}
														{#if i === currentDay && selectedMonth === currentMonth && selectedYear === currentYear}
															<button
																on:click={() => {
																	selectDate(selectedYear, selectedMonth, i);
																}}
																class="rounded focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-700 focus:bg-indigo-500 hover:bg-indigo-500 text-base w-8 h-8 flex items-center justify-center font-medium text-white bg-indigo-700"
																>{i}</button
															>
														{:else if i == +inputTxt.split('-')[2] && selectedMonth === +inputTxt.split('-')[1] && selectedYear === +inputTxt.split('-')[0]}
															<button
																on:click={() => {
																	selectDate(selectedYear, selectedMonth, i);
																}}
																class="rounded focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-bordeau-700 focus:bg-bordeau-500 hover:bg-bordeau-500 text-base w-8 h-8 flex items-center justify-center font-medium text-white bg-bordeau-700"
																>{i}</button
															>
														{:else}
															<p class="text-base text-gray-500 font-medium">
																<button
																	class="border-none"
																	on:click={() => {
																		selectDate(selectedYear, selectedMonth, i);
																	}}
																>
																	{i}
																</button>
															</p>
														{/if}
													{/if}
												</div>
											</td>
										{/each}
									</tr>
								{/each}
							</tbody>
						</table>
					</div>
				</div>
			</div>
		</div>
	</div>
{/if}

<input
	type="text"
	bind:value={inputTxt}
	on:mousedown={(e) => {
		e.preventDefault();
		
	}}
	class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
	on:click={(e) => {
		e.preventDefault();
		isOpenCalendar = true;
	}}
/>

<style>

.close {
		display: block;
		box-sizing: border-box;
		position: absolute;
		z-index: 10;
		top: 1rem;
		right: 1rem;
		margin: 0;
		padding: 0;
		width: 1.5rem;
		height: 1.5rem;
		border: 0;
		color: black;
		border-radius: 1.5rem;
		background: white;
		box-shadow: 0 0 0 1px black;
		transition:
			transform 0.2s cubic-bezier(0.25, 0.1, 0.25, 1),
			background 0.2s cubic-bezier(0.25, 0.1, 0.25, 1);
		-webkit-appearance: none;
	}

	.close:before,
	.close:after {
		content: '';
		display: block;
		box-sizing: border-box;
		position: absolute;
		top: 50%;
		width: 1rem;
		height: 1px;
		background: black;
		transform-origin: center;
		transition:
			height 0.2s cubic-bezier(0.25, 0.1, 0.25, 1),
			background 0.2s cubic-bezier(0.25, 0.1, 0.25, 1);
	}

	.close:before {
		-webkit-transform: translate(0, -50%) rotate(45deg);
		-moz-transform: translate(0, -50%) rotate(45deg);
		transform: translate(0, -50%) rotate(45deg);
		left: 0.25rem;
	}

	.close:after {
		-webkit-transform: translate(0, -50%) rotate(-45deg);
		-moz-transform: translate(0, -50%) rotate(-45deg);
		transform: translate(0, -50%) rotate(-45deg);
		left: 0.25rem;
	}

	.close:hover {
		background: black;
	}

	.close:hover:before,
	.close:hover:after {
		height: 2px;
		background: white;
	}

	.close:focus {
		border-color: #3399ff;
		box-shadow: 0 0 0 2px #3399ff;
	}

	.close:active {
		transform: scale(0.9);
	}

	.close:hover,
	.close:focus,
	.close:active {
		outline: none;
	}
</style>