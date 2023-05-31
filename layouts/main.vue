<template>
	<div class="flex flex-col h-screen">
		<sections-app-header />
		<div class="flex-auto justify-between mt-4 sm:mt-8">
			<div class="w-full">
				<main class="mx-4 sm:mx-auto sm:w-5/6 lg:max-w-5xl xl:max-w-7xl">
					<slot></slot>
				</main>
			</div>
		</div>
		<sections-app-footer />
	</div>
</template>
