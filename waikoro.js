javascript:(function(){
	const users = {};
	const chars = document.querySelectorAll("div #phelen_char_icon_box");
	const char_bet = [];
	const char_bet_user = [];
	const char_state = [];
	const buttons = [];
	const button_state = [];
	let sum = 0;
	let bets = 0;
	let test_bet = 0;
	let test_pot = 0;
	let test_cost = 0;

	const cd = document.getElementById("kousin_box");
	const box = cd.parentNode;
	const pt = box.innerHTML.match(/BET賞金ポット \d+枚/g);
	let pot;

	const p_box = box.nextElementSibling;
	const ra = p_box.innerHTML.match(/BET賞金\d倍/);
	let ratio;
	if(ra!=null){
		ratio = ra[0].replace("BET賞金","").replace("倍","");
		ratio = parseInt(ratio);
	}else{ratio = 1;}

	for(i=0;i<chars.length;i++){
		const disp = document.createElement("p");
		chars[i].prepend(disp);
		disp.classList.add("reward");
		// disp.style.margin = "0";
		const user_reward_p = document.createElement("p");
		disp.after(user_reward_p);
		// user_reward_p.style.margin = "0";
		user_reward_p.classList.add("user_reward");
		
		const test_bet_div = document.createElement("div");
		// test_bet_div.innerHTML = "お試し";
		chars[i].prepend(test_bet_div);
		const test_bet_p = document.createElement("p");
		test_bet_p.innerHTML = "+BET";
		test_bet_p.style.border = "solid 1px #000";
		test_bet_p.style.backgroundColor = "#C3C3C3";
		test_bet_p.style.color = "#000";
		test_bet_p.style.cursor = "pointer";
		test_bet_p.style.display = "inline-block";
		test_bet_p.style.margin = "2px";
		test_bet_div.appendChild(test_bet_p);
		const test_bet_rm = document.createElement("p");
		test_bet_rm.innerHTML = "-BET";
		test_bet_rm.style.border = "solid 1px #000";
		test_bet_rm.style.backgroundColor = "#C3C3C3";
		test_bet_rm.style.color = "#000";
		test_bet_rm.style.cursor = "pointer";
		test_bet_rm.style.display = "inline-block";
		test_bet_rm.style.margin = "2px";
		test_bet_div.appendChild(test_bet_rm);

		const index = i;
		test_bet_p.addEventListener("click", () => {
			const tb = document.createElement("font");
			let bet_value = 300;
			if(ratio==2) bet_value = 1000;
			if(ratio==4) bet_value = 30;
			tb.innerHTML = "お試し " + bet_value + "枚<br>";
			tb.color = "#0a6";
			tb.classList.add("test_bet");
			chars[index].appendChild(tb);
			update();
		});

		test_bet_rm.addEventListener("click", () => {
			const tbs = chars[index].getElementsByClassName("test_bet");
			if(tbs.length!=0){
				chars[index].removeChild(tbs[0]);
				update();
			}
		});
	}

	const display_box = document.createElement("div");
	box.appendChild(display_box);
	const display = document.createElement("p");
	display.style.display = "inline-block";
	display.style.margin = "20px";
	display_box.appendChild(display);
	const display2 = document.createElement("p");
	display2.style.display = "inline-block";
	display2.style.margin = "20px";
	display_box.appendChild(display2);

	const calculate = () => {
		sum = 0;
		bets = 0;
		for(i=0;i<chars.length;i++){
			const f = chars[i].getElementsByTagName("font");

			if(chars.length!=char_bet.length){
				for(j=0;j<chars.length;j++){
					char_bet.push(0);
				}
			}else{
				char_bet[i] = 0;
			}

			if(chars.length!=char_bet_user.length){
				for(j=0;j<chars.length;j++){
					char_bet_user.push([]);
				}
			}

			if(chars.length!=char_state.length){
				char_state.push({light:0,die:0,testBet:0,select:0});
			}
			// console.log(char_state);

			for(const name in users){
				users[name][i] = 0;
			}

			char_state[i]["testBet"] = 0;
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

					let match = false;
					if(char_bet_user[i].length==0){
						char_bet_user[i].push(userName);
					}else{
						for(k=0;k<char_bet_user[i].length;k++){
							if(char_bet_user[i][k]==userName){
								match = true;
							}
						}
						if(!match){
							char_bet_user[i].push(userName);
						}
					}

					if(userName=="お試し"){
						char_state[i]["testBet"] = 1;
					}
				}
			}
			// console.log(char_bet_user);
		}
	};

	const update = () => {
		calculate();
		if(pt!=null){
			pot = pt[0].replace("BET賞金ポット ","").replace("枚","");
			pot = parseInt(pot);
		}else{pot = 0;}

		display.innerHTML = "全体BET:" + bets + "<br>全体BET額:" + sum + "枚<br>BET賞金総額:" + sum + "×" + ratio + "+" + pot + "=" + (sum*ratio+pot) + "枚";
		


		char_state.forEach((char) => {
			char["light"] = 0;
		});

		let pushed_name_i = undefined;

		for(i=0;i<button_state.length;i++){
			// console.log(button_state);
			// console.log(button_state[i]["push"]);
			switch(button_state[i]["push"]){
				case 0:
					// console.log("case:0");
					buttons[i].style.backgroundColor = "#C3C3C3";
					break;
				case 1:
					// console.log("case:1");
					buttons[i].style.backgroundColor = "#7F7F7F";
					pushed_name_i = i;
					break;
				case 2:
					buttons[i].style.backgroundColor = "#FFF200";
					break;
			}

			// const name = buttons[i].innerHTML;

			// for(j=0;j<chars.length;j++){
			// 	const user_reward_p = chars[j].getElementsByClassName("user_reward")[0];
			// 	if(users[name][j]==0){
			// 		chars[j].style.backgroundColor = "";
			// 		chars[j].style.boxShadow = "";
			// 		user_reward_p.innerHTML = "";
			// 	}
			// 	if(button_state[i]["push"]==1 && users[name][j]!=0){
			// 		char_state[j]["light"] = 1;
			// 	}
			// }

			// if(button_state[i]["push"]==1){

			// }
			// char_state.forEach((char,index) => {
			// 	let alone = 1;
			// 	if(char_bet[index]==1 || char_bet_user[index].length==1) alone = 1.2;
			// 	const user_reward_p = chars[index].getElementsByClassName("user_reward")[0];
			// 	const user_reward = users[name][index] * (Math.floor(sum/char_bet[index])*ratio*alone + Math.floor(pot/char_bet[index]));
			// 	if(char["light"]==1){
			// 		chars[index].style.backgroundColor = "rgba(255,242,0,0.25)";
			// 		chars[index].style.boxShadow = "0 0 5px #000";
			// 		user_reward_p.innerHTML = name + " BET:<b>" + users[name][index] + "</b><br>賞金:<b>" + user_reward + "</b>枚";
			// 	}
			// });
		}

		for(i=0;i<chars.length;i++){
			let alone = 1;
			if(char_bet[i]==1 || char_bet_user[i].length==1) alone = 1.2;

			const user_reward_p = chars[i].getElementsByClassName("user_reward")[0];
			chars[i].style.backgroundColor = "";
			chars[i].style.boxShadow = "";
			user_reward_p.innerHTML = "";
			if(pushed_name_i!=undefined){
				const name = buttons[pushed_name_i].innerHTML;
				const user_reward = users[name][i] * (Math.floor(sum/char_bet[i])*ratio*alone + Math.floor(pot/char_bet[i]));
				if(users[name][i]!=0){
					char_state[i]["light"] = 1;
				}
				if(char_state[i]["light"]==1){
					chars[i].style.backgroundColor = "rgba(255,242,0,0.25)";
					chars[i].style.boxShadow = "0 0 5px #000";
					user_reward_p.innerHTML = name + " BET:<b>" + users[name][i] + "</b><br>賞金:<b>" + user_reward + "</b>枚";
				}
			}

			//キャラの上の賞金額とかの表示を更新する奴
			const reward_p = chars[i].getElementsByClassName("reward")[0];
			// let alone = 1;
			// if(char_bet[i]==1 || char_bet_user[i].length==1) alone = 1.2;
			//最初にupdateを実行した際は、sumの計算が途中なため、正しい結果が表示されない。とりあえずupdateを何回も実行しといて。
			const reward = Math.floor(sum/char_bet[i])*ratio*alone+Math.floor(pot/char_bet[i]);
			reward_p.innerHTML = "BET:<b>" + char_bet[i] + "</b><br>賞金:一口<b>" + reward + "</b>枚";

			if(char_state[i]["testBet"]==1){
				const test_reward_p = chars[i].getElementsByClassName("user_reward")[0];
				let test_reward = users["お試し"][i] * reward;
				chars[i].style.backgroundColor = "rgba(181,230,29,0.25)";
				chars[i].style.boxShadow = "0 0 5px #000";
				if(buttons[pushed_name_i]!=undefined){
					const name = buttons[pushed_name_i].innerHTML;
					test_reward = (users[name][i] + users["お試し"][i]) * reward;
					test_reward_p.innerHTML = name + " BET:<b>" + (users[name][i] + users["お試し"][i]) + "</b><br>賞金:<b>" + test_reward + "</b>枚";
				}else{
					test_reward_p.innerHTML = "お試し BET:<b>" + users["お試し"][i] + "</b><br>賞金:<b>" + test_reward + "</b>枚";
				}
			}

			//HP0のキャラを暗くする奴
			const b = chars[i].getElementsByTagName("b");
			for(j=0;j<b.length;j++){
				const hp = b[j].innerHTML.match(/^0<br>$/);
				if(hp!=null){
					chars[i].style.backgroundColor = "rgba(0,0,0,0.25)";
					const imgs = chars[i].getElementsByTagName("img");
					imgs[0].style.opacity = 0.5;
				}
			}

			//char_stateのそれぞれに{light:0,die:0,testBet:0,select:0}を突っ込む。数字一つでやろうとすると、きついので。上でそのパラメータだけいじり、最後にパラメータを参照しながら表示を変更する。
			// if(char_state[i]["light"]==1){

			// }
		}

		let tb_num = 0;
		if(users["お試し"]!=undefined){
			test_bet = 0;
			users["お試し"].forEach((tb) => {
				let bet_value = 300;
				if(ratio==2) bet_value = 1000;
				if(ratio==4) bet_value = 30;
				test_bet += tb*bet_value;
				tb_num += tb;
			});
		}
		if(tb_num!=0){
			display2.innerHTML = "お試しBET:<b>" + tb_num + "</b><br>お試しBET額:<b>" + test_bet + "</b>枚";
		}else{
			display2.innerHTML = "";
		}
		
	};

	update();

	const users_sort = Object.keys(users);
	users_sort.sort();
	const div = document.createElement("div");
	div.innerHTML = "BET者一覧(" + users_sort.length + "名)";
	box.appendChild(div);

	for(i=0;i<users_sort.length;i++){
		const name = users_sort[i];
		const index = i;
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

		if(users_sort.length > button_state.length){
			button_state.push({push:0,die:0,light:0});
		}

		button.addEventListener("click", () => {
			if(button_state[index]["push"]!=1){
				button_state.forEach((state,ind) => {
					// console.log(button_state[ind]["push"]);
					if(button_state[ind]["push"]==1)button_state[ind]["push"] = 0;
				});
				button_state[index]["push"] = 1;
			}else{
				button_state[index]["push"] = 0;
			}
			update();
		});
	}
}());