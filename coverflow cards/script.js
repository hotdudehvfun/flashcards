
	function createSlides()
	{
		var html="";
		timeline.forEach((item,index)=>{

			html+=`<div class="swiper-slide" >`;
				html+=`<div class="note-holder">`;
				html+=`<div class="note">`;
					html+=`${item.text}`;
					html+=`<div class="year">${item.year} <div class=pageno>  (${index+1}/${timeline.length}) </div> </div>`;
				html+=`</div>`;
				html+=`</div>`;
			html+=`</div>`;
		});
		document.querySelector("#parent").innerHTML=html;
	}
	document.addEventListener("DOMContentLoaded",function(){
		createSlides();
		var swiper = new Swiper(".swiper-container", {
			
			effect: "coverflow",
			grabCursor: true,
			centeredSlides: true,
			slidesPerView: "auto",
			coverflow: {
			  rotate: 50,
			  stretch: 0,
			  depth: 100,
			  modifier: 1,
			  slideShadows: true },
		  
			loop: true });
		
	});