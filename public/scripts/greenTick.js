function greenTick_activate(id) {
	const div0 = document.getElementById(id + '0');
	const div1 = document.getElementById(id + '1');
	const div2 = document.getElementById(id + '2');
	const div3 = document.getElementById(id + '3');

	div0.style.display = 'inline-block';

	div1.classList.add("animation_checkmark");
	div2.classList.add("animation_checkmark_circle");
	div3.classList.add("animation_checkmark_check");

}