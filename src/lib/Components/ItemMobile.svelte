<script>
	import {
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
</script>

<TimelineItem style="flex-direction: column; align-items:center;">
	<button
		class="bg-bordeau-500 hover:bg-bordeau-700 text-white font-bold py-1 px-2 rounded w-10 h-10
            
            absolute bottom-0 left-5"
		on:click={() => onEdit(post)}
	>
		<MdEdit />
	</button>
	<button
		class="bg-bordeau-500 hover:bg-bordeau-700 text-white font-bold py-1 px-2 rounded w-10 h-10
                 absolute bottom-0 right-5
            "
		on:click={() => onDelete(post._id, post.public_image_id)}
	>
		<MdDelete />
	</button>
	<TimelineSeparator>
		<TimelineDot
			style="background-color: #A6E1FA; border-radius: 5px; border-color: #603140; width: 40vw"
		>
			<p class="text-indigo-700 font-bold text-xl text-center w-full">{post.date}</p>
		</TimelineDot>
	</TimelineSeparator>

	<div>
		<TimelineOppositeContent slot="opposite-content" style="align-content:center; ">
			<div class="w-screen lg:max-w-sm md:max-w-72">
				<h2 class="text-center text-xl font-bold">{post.title}</h2>
				<p class="text-left break-words px-4">{post.description}</p>
			</div>
		</TimelineOppositeContent>

		<TimelineContent style="align-content:center;">
			<div class="flex items-center justify-center">
				<img
					src={post.image}
					alt={post.title}
					class="object-contain rounded-lg border-2 border-bordeau-500
                        w-80 lg:w-96 lg:h-96 md:w-72 md:h-72
                    "
				/>
			</div>
		</TimelineContent>
	</div>
</TimelineItem>
