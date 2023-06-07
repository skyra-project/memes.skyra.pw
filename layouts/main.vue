<template>
	<div class="flex h-screen flex-col">
		<sections-app-header />
		<div class="mt-4 flex-auto justify-between sm:mt-8">
			<div class="w-full">
				<main class="mx-4 sm:mx-auto sm:w-5/6 lg:max-w-5xl xl:max-w-7xl">
					<slot></slot>
				</main>
			</div>
		</div>
		<sections-app-footer />
	</div>
</template>
