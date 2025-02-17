javascript:(function(){
	const users = {};
	const chars = document.querySelectorAll("div #phelen_char_icon_box");
	const char_bet = [];
	let sum = 0;
	let bets = 0;	
	for(i=0;i<chars.length;i++){
		const f = chars[i].getElementsByTagName("font");
		char_bet.push(0);
		for(j=1;j<f.length;j++){
			const be = f[j].innerHTML.match(/\d+枚/g);
			let bet;
			if(be!=null){
				bet = be[0].replace("枚","");
				bet = parseInt(bet);
				if(!isNaN(bet)){
					sum += bet;
					bets++;
					char_bet[i]++;
				}
			}
			const un = f[j].innerHTML.match(/.+ \d+枚/g);
			let userName = un[0];
			if(un!=null){
				userName = un[0].replace(/ \d+枚/,"");
				if(users[userName]==undefined){
					users[userName] = [];
					for(k=0;k<chars.length;k++){
						users[userName].push(0);
					}
					users[userName][i]++;
				}else{
					users[userName][i]++;
				}
			}
		}

		const b = chars[i].getElementsByTagName("b");
		for(j=0;j<b.length;j++){
			const hp = b[j].innerHTML.match(/^0<br>$/);
			if(hp!=null){
				chars[i].style.backgroundColor = "rgba(0,0,0,0.25)";
				const imgs = chars[i].getElementsByTagName("img");
				imgs[0].style.opacity = 0.5;
			}
		}
	}

	const cd = document.getElementById("kousin_box");
	const box = cd.parentNode;
	const pt = box.innerHTML.match(/BET賞金ポット \d+枚/g);
	let pot;
	if(pt!=null){
		pot = pt[0].replace("BET賞金ポット ","").replace("枚","");
		pot = parseInt(pot);
	}else{pot = 0;}

	const p_box = box.nextElementSibling;
	const ra = p_box.innerHTML.match(/BET賞金\d倍/);
	let ratio;
	if(ra!=null){
		ratio = ra[0].replace("BET賞金","").replace("倍","");
		ratio = parseInt(ratio);
	}else{ratio = 1;}

	for(i=0;i<chars.length;i++){
		let alone = 1;
		if(char_bet[i]==1) alone = 1.2;
		const disp = document.createElement("p");
		const reward = Math.floor(sum/char_bet[i])*ratio*alone+Math.floor(pot/char_bet[i]);
		disp.innerHTML = "BET:<b>" + char_bet[i] + "</b><br>賞金:一口<b>" + reward + "</b>枚";
		chars[i].prepend(disp);
		disp.classList.add("reward");

		const user_reward_p = document.createElement("p");
		disp.after(user_reward_p);
		user_reward_p.classList.add("user_reward");
	}
	
	const display = document.createElement("p");
	display.innerHTML = "全体BET:" + bets + "<br>全体BET額:" + sum + "枚<br>BET賞金総額:" + sum + "×" + ratio + "+" + pot + "=" + (sum*ratio+pot) + "枚";
	box.appendChild(display);

	const users_sort = Object.keys(users);
	users_sort.sort();
	const div = document.createElement("div");
	div.innerHTML = "BET者一覧(" + users_sort.length + "名)";
	box.appendChild(div);
	const buttons = [];

	users_sort.forEach((name)=>{
		const button = document.createElement("p");
		button.innerHTML = name;
		div.appendChild(button);
		buttons.push(button);
		button.style.border = "solid 1px #000";
		button.style.backgroundColor = "#C3C3C3";
		button.style.display = "inline-block";
		button.style.margin = "2px";
		button.style.color = "#000";
		button.style.cursor = "pointer";

		button.addEventListener("click", () => {
			buttons.forEach((b) => {
				b.style.backgroundColor = "#C3C3C3";
			});
			button.style.backgroundColor = "#7F7F7F";
			for(i=0;i<chars.length;i++){
				let alone = 1;
				if(char_bet[i]==1) alone = 1.2;
				const ur_p = chars[i].getElementsByClassName("user_reward");
				const user_reward_p = ur_p[0];
				const user_reward = users[name][i] * (Math.floor(sum/char_bet[i])*ratio*alone + Math.floor(pot/char_bet[i]));
				if(users[name][i]!=0){
					// chars[i].style.outline = "solid 1px #000";
					// chars[i].style.outlineOffset = "-1px";
					chars[i].style.backgroundColor = "rgba(255,242,0,0.25)";
					chars[i].style.boxShadow = "1px 1px 5px #000";
					user_reward_p.innerHTML = name + " BET:<b>" + users[name][i] + "</b><br>賞金:<b>" + user_reward + "</b>枚";
				}else {
					// chars[i].style.outline = "";
					chars[i].style.backgroundColor = "";
					chars[i].style.boxShadow = "";
					user_reward_p.innerHTML = "";
				}
				const b = chars[i].getElementsByTagName("b");
				for(j=0;j<b.length;j++){
					const hp = b[j].innerHTML.match(/^0<br>$/);
					if(hp!=null){
						chars[i].style.backgroundColor = "rgba(0,0,0,0.25)";
						const imgs = chars[i].getElementsByTagName("img");
						imgs[0].style.opacity = 0.5;
					}
				}
			}
		});
	});
}());
