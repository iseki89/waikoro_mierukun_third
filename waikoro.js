javascript:(function(){
	const users = {};
	const chars = document.querySelectorAll("div #phelen_char_icon_box");
	const char_bet = [];
	const char_bet_user = [];
	const char_state = [];
	const buttons = [];
	const button_state = [];
	const user_sum = {};
	const user_bet = {};
	let sum = 0;
	let bets = 0;
	let test_bet = 0;
	let test_pot = [0,0,0];
	let test_pot_sum = 0;
	let test_cost = 0;
	let test_hp = 0;

	const cd = document.getElementById("kousin_box");
	const box = cd.parentNode;
	let pt = box.innerHTML.match(/BET賞金ポット \d*枚/g);
	let pot;

	const p_box = box.nextElementSibling;
	const ra = p_box.innerHTML.match(/BET賞金\d倍/);
	let ratio;
	if(ra!=null){
		ratio = ra[0].replace("BET賞金","").replace("倍","");
		ratio = parseInt(ratio);
	}else{ratio = 1;}
	const ra2 = p_box.innerHTML.match(/応援効果\d倍/);
	let ratio2;
	if(ra2!=null){
		ratio2 = ra2[0].replace("応援効果","").replace("倍","");
		ratio2 = parseInt(ratio2);
	}else{ratio2 = 1;}

	if(pt!=null){
		pot = pt[0].replace("BET賞金ポット ","").replace("枚","");
		pot = parseInt(pot);
	}else{pot = 0;}

	if(chars.length!=char_bet_user.length){
		for(i=0;i<chars.length;i++){
			char_bet_user.push([]);
		}
	}

	if(chars.length!=char_state.length){
		for(i=0;i<chars.length;i++){
			char_state.push({light:0,die:0,testBet:0,select:0});
		}
	}

	for(i=0;i<chars.length;i++){
		const disp = document.createElement("p");
		chars[i].prepend(disp);
		disp.classList.add("reward");
		const user_reward_p = document.createElement("p");
		disp.after(user_reward_p);
		user_reward_p.classList.add("user_reward");
		
		const test_bet_div = document.createElement("div");
		test_bet_div.style.height = "0";
		test_bet_div.style.width = "0";
		test_bet_div.classList = "test_bet_div";
		chars[i].prepend(test_bet_div);
		const test_bet_p = document.createElement("p");
		test_bet_p.innerHTML = "";
		test_bet_p.style.border = "";
		test_bet_p.style.backgroundColor = "#C3C3C3";
		test_bet_p.style.color = "#000";
		test_bet_p.style.cursor = "pointer";
		test_bet_p.style.display = "inline-block";
		test_bet_p.style.margin = "";
		test_bet_p.style.userSelect = "none";
		test_bet_p.classList = "test_bet_button_p";
		test_bet_div.appendChild(test_bet_p);
		const test_bet_rm = document.createElement("p");
		test_bet_rm.innerHTML = "";
		test_bet_rm.style.border = "";
		test_bet_rm.style.backgroundColor = "#C3C3C3";
		test_bet_rm.style.color = "#000";
		test_bet_rm.style.cursor = "pointer";
		test_bet_rm.style.display = "inline-block";
		test_bet_rm.style.margin = "";
		test_bet_rm.style.userSelect = "none";
		test_bet_rm.classList = "test_bet_button_m";
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
			reset_p[1].innerHTML = "お試し合計<br>POT:+<b>" + test_pot_sum + "</b>枚<br>消費:<b>"+ (test_cost+test_bet) + "</b>枚<br>HP:+<b>" + test_hp + "</b>";
		});

		test_bet_rm.addEventListener("click", () => {
			const tbs = chars[index].getElementsByClassName("test_bet");
			if(tbs.length!=0){
				chars[index].removeChild(tbs[0]);
				update();
				reset_p[1].innerHTML = "お試し合計<br>POT:+<b>" + test_pot_sum + "</b>枚<br>消費:<b>"+ (test_cost+test_bet) + "</b>枚<br>HP:+<b>" + test_hp + "</b>";
			}
		});

		const img = chars[i].getElementsByTagName("img")[0];
		const a = img.parentNode;
		a.href = "javascript:void(0)";
		img.addEventListener("click", () => {
			if(char_state[index]["select"]==0){
				for(j=0;j<chars.length;j++){
					char_state[j]["select"] = 0;
				}
				char_state[index]["select"] = 1;
				for(j=0;j<buttons.length;j++){
					button_state[j]["light"] = 0;
					for(k=0;k<char_bet_user[index].length;k++){
						if(buttons[j].innerHTML==char_bet_user[index][k]){
							button_state[j]["light"] = 1;
						}
					}
				}
			}else{
				char_state[index]["select"] = 0;
				for(j=0;j<buttons.length;j++){
					button_state[j]["light"] = 0;
				}
			}

			update();
		});
	}

	const display_box = document.createElement("div");
	display_box.style.height = "auto";
	box.appendChild(display_box);
	const display = document.createElement("p");
	display.style.display = "inline-block";
	display.style.margin = "0 20px";
	display_box.appendChild(display);
	const display2 = document.createElement("div");
	display2.style.display = "inline-block";
	display2.style.margin = "0 20px";
	display_box.appendChild(display2);

	const tb_display = [document.createElement("p"),document.createElement("p")];
	tb_display[0].innerHTML = "お試しBET<br>ボタンを表示";
	tb_display[0].style.height = "40px";
	tb_display[0].style.width = "91px";
	tb_display[0].style.border = "solid 1px #000";
	tb_display[0].style.backgroundColor = "#C3C3C3";
	tb_display[0].style.color = "#000";
	tb_display[0].style.cursor = "pointer";
	tb_display[0].style.userSelect = "none";
	tb_display[0].style.textAlign = "center";
	tb_display[1].style.height = "40px";
	display2.appendChild(tb_display[1]);
	display2.appendChild(tb_display[0]);
	let tb_toggle = false;
	tb_display[0].addEventListener("click", () => {
		const tbbp = document.body.getElementsByClassName("test_bet_button_p");
		const tbbm = document.body.getElementsByClassName("test_bet_button_m");
		const tbd = document.body.getElementsByClassName("test_bet_div");
		if(!tb_toggle){
			for(i=0;i<tbbp.length;i++){
				tbbp[i].innerHTML = "+BET";
				tbbm[i].innerHTML = "-BET";
				tbbp[i].style.border = "solid 1px #000";
				tbbm[i].style.border = "solid 1px #000";
				tbbp[i].style.margin = "2px";
				tbbm[i].style.margin = "2px";
				tbd[i].style.height = "";
				tbd[i].style.width = "";
			}
			tb_toggle = true;
			tb_display[0].innerHTML = "お試しBET<br>ボタンを非表示";
		}else if(tb_toggle){
			for(i=0;i<tbbp.length;i++){
				tbbp[i].innerHTML = "";
				tbbm[i].innerHTML = "";
				tbbp[i].style.border = "";
				tbbm[i].style.border = "";
				tbbp[i].style.margin = "";
				tbbm[i].style.margin = "";
				tbd[i].style.height = "0";
				tbd[i].style.width = "0";
			}
			tb_toggle = false;
			tb_display[0].innerHTML = "お試しBET<br>ボタンを表示";
		}
	});

	const display3 = document.createElement("div");
	display3.style.display = "inline-block";
	display_box.appendChild(display3);
	const test_love_box = [];
	for(i=0;i<4;i++){
		const d = document.createElement("div");
		d.style.display = "inline-block";
		d.style.margin = "0px 5px";
		test_love_box.push(d);
		display3.appendChild(test_love_box[i]);
	}
	const cheer_p = [];
	const aid_p = [];
	const love_p = [];
	const reset_p = [];
	for(i=0;i<2;i++){
		cheer_p.push(document.createElement("p"));
		aid_p.push(document.createElement("p"));
		love_p.push(document.createElement("p"));
		reset_p.push(document.createElement("p"));
	}
	cheer_p[0].innerHTML = "お試し応援";
	aid_p[0].innerHTML = "お試し救援";
	love_p[0].innerHTML = "お試しラブコ";
	reset_p[0].innerHTML = "リセット";
	cheer_p[0].style.border = "solid 1px #000";
	cheer_p[0].style.backgroundColor = "#C3C3C3";
	cheer_p[0].style.color = "#000";
	cheer_p[0].style.cursor = "pointer";
	cheer_p[0].style.userSelect = "none";
	cheer_p[0].style.textAlign = "center";
	aid_p[0].style.border = "solid 1px #000";
	aid_p[0].style.backgroundColor = "#C3C3C3";
	aid_p[0].style.color = "#000";
	aid_p[0].style.cursor = "pointer";
	aid_p[0].style.userSelect = "none";
	aid_p[0].style.textAlign = "center";
	love_p[0].style.border = "solid 1px #000";
	love_p[0].style.backgroundColor = "#C3C3C3";
	love_p[0].style.color = "#000";
	love_p[0].style.cursor = "pointer";
	love_p[0].style.userSelect = "none";
	love_p[0].style.textAlign = "center";
	reset_p[0].style.border = "solid 1px #000";
	reset_p[0].style.backgroundColor = "#C3C3C3";
	reset_p[0].style.color = "#000";
	reset_p[0].style.cursor = "pointer";
	reset_p[0].style.userSelect = "none";
	reset_p[0].style.textAlign = "center";

	for(i=0;i<2;i++){
		cheer_p[i].style.margin = "0";
		aid_p[i].style.margin = "0";
		love_p[i].style.margin = "0";
		reset_p[i].style.margin = "0";
		test_love_box[0].appendChild(cheer_p[i]);
		test_love_box[1].appendChild(aid_p[i]);
		test_love_box[2].appendChild(love_p[i]);
		test_love_box[3].appendChild(reset_p[i]);
	}
	cheer_p[1].innerHTML = "回数:<b>0</b><br>POT:+<b>0</b>枚<br>消費:<b>0</b>枚<br>HP:+<b>0</b>";
	aid_p[1].innerHTML = "回数:<b>0</b><br>POT:+<b>0</b>枚<br>消費:<b>0</b>枚<br>HP:+<b>0</b>";
	love_p[1].innerHTML = "回数:<b>0</b><br>POT:+<b>0</b>枚<br>消費:<b>0</b>枚<br>HP:+<b>0</b>";
	reset_p[1].innerHTML = "お試し合計<br>POT:+<b>" + test_pot_sum + "</b>枚<br>消費:<b>"+ test_cost + "</b>枚<br>HP:+<b>" + test_hp + "</b>";
	// cheer_p[1].style.fontSize = "";
	// aid_p[1].style.fontSize = "";
	// love_p[1].style.fontSize = "";
	// reset_p[1].style.fontSize = "";
	cheer_p[0].addEventListener("click", () => {
		pot += 50;
		test_pot_sum += 50;
		test_cost += 100;
		test_hp += 5*ratio2;
		test_pot[0]++;
		cheer_p[1].innerHTML = "回数:<b>" + test_pot[0] + "</b><br>POT:+<b>" + (test_pot[0]*50) + "</b>枚<br>消費:<b>" + (test_pot[0]*100) + "</b>枚<br>HP:+<b>" + test_pot[0]*5*ratio2 + "</b>";
		reset_p[1].innerHTML = "お試し合計<br>POT:+<b>" + test_pot_sum + "</b>枚<br>消費:<b>"+ (test_cost+test_bet) + "</b>枚<br>HP:+<b>" + test_hp + "</b>";
		update();
	});
	aid_p[0].addEventListener("click", () => {
		pot += 250;
		test_pot_sum += 250;
		test_cost += 500;
		test_hp += 30*ratio2;
		test_pot[1]++;
		aid_p[1].innerHTML = "回数:<b>" + test_pot[1] + "</b><br>POT:+<b>" + (test_pot[1]*250) + "</b>枚<br>消費:<b>" + (test_pot[1]*500) + "</b>枚<br>HP:+<b>" + test_pot[1]*30*ratio2 + "</b>";
		reset_p[1].innerHTML = "お試し合計<br>POT:+<b>" + test_pot_sum + "</b>枚<br>消費:<b>"+ (test_cost+test_bet) + "</b>枚<br>HP:+<b>" + test_hp + "</b>";
		update();
	});
	love_p[0].addEventListener("click", () => {
		pot += 750;
		test_pot_sum += 750;
		test_cost += 1500;
		test_hp += 100*ratio2;
		test_pot[2]++;
		love_p[1].innerHTML = "回数:<b>" + test_pot[2] + "</b><br>POT:+<b>" + (test_pot[2]*750) + "</b>枚<br>消費:<b>" + (test_pot[2]*1500) + "</b>枚<br>HP:+<b>" + test_pot[2]*100*ratio2 + "</b>";
		reset_p[1].innerHTML = "お試し合計<br>POT:+<b>" + test_pot_sum + "</b>枚<br>消費:<b>"+ (test_cost+test_bet) + "</b>枚<br>HP:+<b>" + test_hp + "</b>";
		update();
	});
	reset_p[0].addEventListener("click", () => {
		for(i=0;i<3;i++){
			test_pot[i] = 0;
		}
		if(pt!=null){
			pot = pt[0].replace("BET賞金ポット ","").replace("枚","");
			pot = parseInt(pot);
		}else{pot = 0;}
		test_pot_sum = 0;
		test_cost = 0;
		test_hp = 0;
		for(i=0;i<chars.length;i++){
			const tb = chars[i].getElementsByClassName("test_bet");
			const length = tb.length;
			for(j=0;j<length;j++){
				chars[i].removeChild(tb[0]);
			}
		}
		update();
		cheer_p[1].innerHTML = "回数:<b>0</b><br>POT:+<b>0</b>枚<br>消費:<b>0</b>枚<br>HP:+<b>0</b>";
		aid_p[1].innerHTML = "回数:<b>0</b><br>POT:+<b>0</b>枚<br>消費:<b>0</b>枚<br>HP:+<b>0</b>";
		love_p[1].innerHTML = "回数:<b>0</b><br>POT:+<b>0</b>枚<br>消費:<b>0</b>枚<br>HP:+<b>0</b>";
		reset_p[1].innerHTML = "お試し合計<br>POT:+<b>" + test_pot_sum + "</b>枚<br>消費:<b>"+ (test_cost+test_bet) + "</b>枚<br>HP:+<b>" + test_hp + "</b>";
	});

	const calculate = () => {
		sum = 0;
		bets = 0;
		for(const name in user_sum){
			user_sum[name] = 0;
		}
		for(const name in user_bet){
			user_bet[name] = 0;
		}

		for(i=0;i<chars.length;i++){
			const f = chars[i].getElementsByTagName("font");

			if(chars.length!=char_bet.length){
				for(j=0;j<chars.length;j++){
					char_bet.push(0);
				}
			}else{
				char_bet[i] = 0;
			}

			for(const name in users){
				users[name][i] = 0;
			}

			char_state[i]["testBet"] = 0;
			for(j=1;j<f.length;j++){
				const be = f[j].innerHTML.match(/\d*枚/g);
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
				const un = f[j].innerHTML.match(/.+ \d*枚/g);
				let userName = un[0];
				if(un!=null){
					userName = un[0].replace(/ \d*枚/,"");
					if(users[userName]==undefined){
						users[userName] = [];
						user_sum[userName] = bet;
						for(k=0;k<chars.length;k++){
							users[userName].push(0);
						}
						users[userName][i]++;
					}else{
						users[userName][i]++;
						user_sum[userName] += bet;
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
		}

		for(const name in users){
			users[name].forEach((count) => {
				if(user_bet[name]==undefined){
					user_bet[name] = count;
				}else{
					user_bet[name] += count;
				}
			});
		}

	};

	const update = () => {
		calculate();

		display.innerHTML = "全体BET:" + bets + "<br>全体BET額:" + sum + "枚<br>賞金POT:" + pot + "枚<br>BET賞金総額:" + sum + "×" + ratio + "+" + pot + "=" + (sum*ratio+pot) + "枚";
		
		char_state.forEach((char) => {
			char["light"] = 0;
		});

		let pushed_name_i = undefined;

		for(i=0;i<button_state.length;i++){
			if(button_state[i]["push"]==1){
				pushed_name_i = i;
			}
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
				chars[i].style.backgroundColor = "rgba(122,255,122,0.25)";
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

			if(char_state[i]["select"]==1){
				chars[i].style.backgroundColor = "rgba(153,217,234,0.25)";
				chars[i].style.boxShadow = "0 0 8px #000 inset";
			}
		}

		for(i=0;i<buttons.length;i++){
			let isDie = true;
			for(j=0;j<users[buttons[i].innerHTML].length;j++){
				if(users[buttons[i].innerHTML][j]!=0){
					console.log(chars[j].innerHTML);
					const hpb = chars[j].innerHTML.match(/HP <b>\d*<br><[/]b>/);
					console.log(hpb);
					if(hpb!=null){
						let hp = hpb[0].replace(/HP <b>/, "").replace(/<br><[/]b>/, "");
						hp = parseInt(hp);
						if(!isNaN(hp) && hp!=0)isDie = false;
					}
				}
			}
			if(isDie){
				button_state[i]["die"] = 1;
			}else{
				button_state[i]["die"] = 0;
			}
		}

		for(i=0;i<button_state.length;i++){
			if(button_state[i]["push"]==1){
				buttons[i].style.backgroundColor = "#FFF200";
				buttons[i].style.boxShadow = "0 0 3px #000 inset";
			}else if(button_state[i]["light"]==1){
				buttons[i].style.backgroundColor = "#7affff";
				buttons[i].style.boxShadow = "0 0 3px #000";
			}else if(button_state[i]["die"]==1){
				buttons[i].style.backgroundColor = "#7F7F7F";
				buttons[i].style.boxShadow = "none";
			}else{
				buttons[i].style.backgroundColor = "#C3C3C3";
				buttons[i].style.boxShadow = "none";
			}
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

		if(pushed_name_i!=undefined){
			const name = buttons[pushed_name_i].innerHTML;
			if(tb_num!=0){
				tb_display[1].innerHTML = name +  " BET: <b>" + user_bet[name] + "</b>+<b><span style='color:#22B14C;'>" + tb_num + "</span></b><br>" + name + " BET額: <b><span style='color:#22B14C;'>" + (user_sum[name]+test_bet) + "</span></b>枚";
			}else{
				tb_display[1].innerHTML = name +  " BET: <b>" + user_bet[name] + "</b><br>" + name + " BET額: <b>" + user_sum[name] + "</b>枚";
			}
		}else{
			if(tb_num!=0){
				tb_display[1].innerHTML = "お試しBET: <b><span style='color:#22B14C;'>" + tb_num + "</span></b><br>お試しBET額: <b><span style='color:#22B14C;'>" + test_bet + "</span></b>枚";
			}else{
				tb_display[1].innerHTML = "";
			}
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
		button.style.userSelect = 'none';

		if(users_sort.length > button_state.length){
			button_state.push({push:0,die:0,light:0});
		}

		button.addEventListener("click", () => {
			if(button_state[index]["push"]!=1){
				button_state.forEach((state,ind) => {
					if(button_state[ind]["push"]==1)button_state[ind]["push"] = 0;
				});
				button_state[index]["push"] = 1;
			}else{
				button_state[index]["push"] = 0;
			}
			update();
		});
	}
	update();
}());