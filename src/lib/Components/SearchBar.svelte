<script>
	let search = '';

	function onSearch() {
		fetch(`/search?search=${search}`)
			.then((res) => res.json())
			.then((data) => {
				console.log(data);
				if (!data.error) {
					window.location.reload();
				}
			})
			.catch((err) => console.log(err));
	}
</script>

<div
	class="text-center
    w-11/12
    flex
    flex-row
    items-center
    justify-center
    mt-4
    mb-4
    relative
"
>
	<form class="w-full" on:submit={onSearch}>
		<input
			id="search"
			class="shadow appearance-none border rounded w-11/12 py-2 pr-3 pl-10 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
			type="text"
			placeholder="Search..."
			bind:value={search}
		/>
	</form>
</div>

<style>
	#search {
		background-image: url('https://upload.wikimedia.org/wikipedia/commons/thumb/0/0b/Search_Icon.svg/1024px-Search_Icon.svg.png');
		background-size: contain;
		background-repeat: no-repeat;
		outline: 0;
		background-position: 12px;
		background-size: 25px;
	}
</style>
