import $ from "jquery";

if (!localStorage.hasOwnProperty("data")) {
	localStorage.setItem(
		"data",
		JSON.stringify({
			count: null,
			limitNews: 7,
			page: 0,
			newsData: [],
			locationName: "",
		})
	);
}

const dropItem = $(".head__drop-item");
const data = JSON.parse(localStorage.getItem("data"));
const location = $("<a/>", {
	class: "link",
	href: document.location.pathname,
	text: data.locationName,
});

///////////  FUNCTIONS  /////////////

function buildPagination(count) {
	$(".pagination__numbs").html("");

	for (let i = 0; i < count; i++) {
		const paginationButton = $("<button/>", {
			class: "pagination__btn",
			text: i + 1,
		});

		$(".pagination__numbs").append(paginationButton);

		paginationButton.on("click", (e) => {
			data.page = i;

			getNews();
		});
	}
}

function buildNews(arr) {
	const newsButton = $("<div/>", {
		class: "news-block__foot",
	}).append(
		$("<button/>", {
			class: "news-block__button btn",
			text: "Подробнее",
		})
	);
	$(".content__news").html("");

	arr.map((item) => {
		const articleElem = $("<article />", {
			class: "content__news-block news-block",
		});
		const imageBlock = $("<div/>", {
			class: "news-block__img",
		}).append($("<img/>", { src: item.image, alt: item.id }));
		const contentBlock = $("<div/>", { class: "news-block__content" });
		const newsCont = $("<div/>", { class: "news-block__info" });
		const newsTitle = $("<H3/>", {
			class: "news-block__title",
			text: item.title,
		});
		const newsDate = $("<div/>", {
			class: "news-block__date",
			text: item.date,
		});
		const newsDescription = $("<div/>", {
			class: "news-block__description",
		}).append(
			$("<p/>", {
				class: "news-block__description-paragraph",
				text: item.description,
			})
		);

		newsCont.append(newsTitle).append(newsDate).append(newsDescription);

		contentBlock.append(newsCont).append(newsButton.clone(true));
		articleElem.append(imageBlock).append(contentBlock);

		$(".content__news").append(articleElem);
	});
}

async function getNews() {
	try {
		let resp = await fetch("./news.json");
		let news = await resp.json();
		if (!news.length) {
			return new Error("Ошибка запроса");
		}
		data.count = Math.ceil(news.length / data.limitNews);

		buildPagination(data.count);
		data.newsData = news.splice(data.page * data.limitNews, data.limitNews);
		buildNews(data.newsData);

		$(".pagination__btn").each((ind, btn) => {
			if (ind === data.page + 1) {
				$(btn).addClass("active");
			} else {
				$(btn).removeClass("active");
			}
		});

		if (data.page === 0) {
			$(".prev-btn").attr("disabled", true);
		} else {
			$(".prev-btn").attr("disabled", false);
		}

		if (data.page + 1 === data.count) {
			$(".next-btn").attr("disabled", true);
		} else {
			$(".next-btn").attr("disabled", false);
		}

		localStorage.setItem("data", JSON.stringify(data));
	} catch (error) {
		console.log(error);
	}
}

///////////  EVENT LISTENRS  /////////////

$(".content__navigate").append(location);

$(".link").each(function (ind, elem) {
	$(elem).on("click", (e) => {
		data.locationName =
			document.location.pathname === "" ? "/" + e.target.innerHTML : "";

		localStorage.setItem("data", JSON.stringify(data));
	});
});

$(".prev-btn").on("click", () => {
	if (data.page > 0) {
		data.page -= 1;
	}

	localStorage.setItem("data", JSON.stringify(data));
	getNews();
});

$(".next-btn").on("click", () => {
	if (data.page + 1 < data.count) {
		data.page += 1;
	}

	localStorage.setItem("data", JSON.stringify(data));
	getNews();
});

$(".head__navbar").on("click", (e) => {
	$(".head__drop-menu").toggleClass("active");
});

$(".link__address").on("click", function (e) {
	console.log(e);
	navigator.clipboard.writeText(e.target.innerText).then(() => {
		$(".link__address-hint")
			.addClass("active")
			.css({ left: e.offsetX, top: e.offsetY });
		setTimeout(() => {
			$(".link__address-hint").removeClass("active");
		}, 1500);
	});
});

$(".link__email").on("click", function (e) {
	navigator.clipboard.writeText(e.target.text).then(() => {
		$(".link__email-hint")
			.addClass("active")
			.css({ left: e.offsetX, top: e.offsetY });
		setTimeout(() => {
			$(".link__email-hint").removeClass("active");
		}, 1500);
	});
});

getNews();

dropItem.each((item, elem) => {
	$(elem).on("click", function (e) {
		window.location.replace(e.target.dataset.link);
	});
});

$(".drop__close-btn").on("click", (e) => {
	$(".drop").css("display", "none").removeClass("drop-open");
	$(".drop__menu").removeClass("drop-open");
	$("body").removeClass("no-scroll");
});

$(".drop").on("click", (e) => {
	if (!e.target.classList.contains("drop")) {
		return;
	}
	$(".drop").css("display", "none").removeClass("drop-open");
	$(".drop__menu").removeClass("drop-open");
	$("body").removeClass("no-scroll");
});

$(".mobile__menu-btn").on("click", (e) => {
	$(".drop").css("display", "block").toggleClass("drop-open");
	$(".drop__menu").toggleClass("drop-open");
	$("body").addClass("no-scroll");
});

$(".prev-btn").on("click", (e) => {});
