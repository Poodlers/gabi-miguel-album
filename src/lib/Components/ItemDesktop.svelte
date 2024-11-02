<script>
	import {
		TimelineConnector,
		TimelineContent,
		TimelineDot,
		TimelineItem,
		TimelineOppositeContent,
		TimelineSeparator
	} from 'svelte-vertical-timeline';
	// @ts-ignore
	import MdDelete from 'svelte-icons/md/MdDelete.svelte';
	// @ts-ignore
	import MdEdit from 'svelte-icons/md/MdEdit.svelte';
	export let post;
	export let onEdit;
	export let onDelete;
	export let isNewDate;
</script>

<TimelineItem>
	<button
		class="bg-bordeau-500 hover:bg-bordeau-700 text-white font-bold py-1 px-2 rounded w-10 h-10
            absolute bottom-0 left-3"
		on:click={() => onEdit(post)}
	>
		<MdEdit />
	</button>
	<button
		class="bg-bordeau-500 hover:bg-bordeau-700 text-white font-bold py-1 px-2 rounded w-10 h-10
                 absolute bottom-0 right-3
            "
		on:click={() => onDelete(post._id, post.public_image_id)}
	>
		<MdDelete />
	</button>
	<TimelineSeparator>
		{#if isNewDate}
			<TimelineDot
				style="background-color: #A6E1FA; border-radius: 5px; border-color: #603140; width: 15vw;"
			>
				<p class="text-indigo-700 font-bold text-xl text-center w-full">{post.date}</p>
			</TimelineDot>
		{/if}

		<TimelineConnector></TimelineConnector>
	</TimelineSeparator>

	<TimelineOppositeContent slot="opposite-content" style="align-content:center;  ">
		<div class="w-screen lg:max-w-md md:max-w-72">
			<h2 class="text-center text-xl font-bold">{post.title}</h2>

			<p class="text-left break-words px-4">{post.description}</p>
		</div>
	</TimelineOppositeContent>

	<TimelineContent style="align-content:center;">
		<div class="flex items-center justify-center">
			{#if post.resource_type === 'video'}
				<video
					src={post.image}
					class="w-10/12 h-auto rounded-lg border border-gray-200 dark:border-gray-700"
					controls
				>
					<track kind="captions" src="path/to/captions.vtt" srclang="en" label="English" default />
				</video>
			{:else}
				<img
					src={post.image}
					alt={post.title}
					class="object-contain rounded-lg border-2 border-bordeau-500
						w-80 lg:w-9/12 md:w-72
					"
				/>
			{/if}
		</div>
	</TimelineContent>
</TimelineItem>
