$(document).ready(() => {
	let table = new DataTable('#myTable', {
		// paging: false,
		data: pals,
		columns: [
			{ data: "number", title: "number" },
			{ data: "name", title: "name" },
			{ data: "abilities.cooling", title: "cooling", defaultContent: "" },
			{ data: "abilities.electricity", title: "electricity", defaultContent: "" },
			{ data: "abilities.farming", title: "farming", defaultContent: "" },
			{ data: "abilities.gathering", title: "gathering", defaultContent: "" },
			{ data: "abilities.handiwork", title: "handiwork", defaultContent: "" },
			{ data: "abilities.kindling", title: "kindling", defaultContent: "" },
			{ data: "abilities.lumbering", title: "lumbering", defaultContent: "" },
			{ data: "abilities.medicine", title: "medicine", defaultContent: "" },
			{ data: "abilities.mining", title: "mining", defaultContent: "" },
			{ data: "abilities.planting", title: "planting", defaultContent: "" },
			{ data: "abilities.transporting", title: "transporting", defaultContent: "" },
			{ data: "abilities.watering", title: "watering", defaultContent: "" },
			{ data: "drops", title: "drops", render: "[, ]", defaultContent: "" },
		],
		processing: true,
		responsive: true,
	});
});

