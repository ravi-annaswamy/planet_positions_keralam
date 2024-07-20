var J2000 = 2451545.0;

var SUN = 0;
var MON = 1;
var MAR = 2;
var MER = 3;
var JUP = 4;
var VEN = 5;
var SAT = 6;
var RAH = 7;
var KET = 8;


//var pp = new Array(9);
//var jd = get_jul_day(1, 1, 2100) - 0.5;
//console.log(date2jul(1, 1, 2100) - 0.5);
//
///*
// var sunp = planetPos(0,jd,false);
// console.log(sunp);
// var merp = planetPos(1,jd,true);
// console.log(merp);
// console.log(rtd(merp[0]));
// 
// var geop = heliotoeclip(jd,1,merp[0],merp[1],merp[2],sunp[0],sunp[1],sunp[2]);
// console.log(geop);
// */
//var t = (jd - J2000) / 36525; // dates post J2000 should add 0.5?
//console.log(jd);
//console.log(t);
//planets(t, pp, false);
//console.log(pr(pp[SUN]));
//console.log(pr(pp[MON]));
//console.log(pr(pp[MER]));
//console.log(pr(pp[VEN]));
//console.log(pr(pp[MAR]));
//console.log(pr(pp[JUP]));
//console.log(pr(pp[SAT]));
//console.log(pr(pp[RAH]));
//console.log(pr(pp[KET]));

/*
 for(var j = 0; j < 20; j++){
 jd = 2415020+Math.floor((Math.random()*50000)+1);
 var t = (jd - 0.5 - J2000) / 36525;
 planets(t, pp, false);
 var s = ""+jd.toFixed(2)+" ";
 for(var i = 0; i < KET; i++)
 s += pp[i].toFixed(2)+" ";
 s += "<br>";
 document.write(s);
 }
 */
// console.log(s);
// showstring(s);

function showstring(s) {
    document.write(s);
}
// convert date to julian
function get_jul_day(mon, day, year) {
    console.log(mon + "/" + day + "/" + year);
    var im, j;
    im = Math.floor(12 * (year + 4800) + mon - 3);
    j = Math.floor((2 * Math.floor(im % 12) + 7 + 365 * im) / 12);
    j += Math.floor(day + im / 48 - 32083);
    if (j > 2299171)
	j += Math.floor(im / 4800) - Math.floor(im / 1200) + 38;
    console.log(parseFloat(j));
    return Math.floor(j);
}

function getayan(t) {
    // return 0;
    return -((5029 + 1.11 * t) * t + 85886) / 3600; // use this value for lahiri
}

function getterms(pp, num, t) {
    var v = 0;
    for (var i = 0; i < num / 3; i++) {
	var a = (pp[i * 3]) * 1.0e-8;
	var b = (pp[i * 3 + 1]) * 1.0e-8;
	var c = (pp[i * 3 + 2]) * 1.0e-3;
	v += a * Math.cos(b + (c * t));
    }
    return v;
}

function getplanet(t, pol, lrg, tlist, tnum) {
    var u = t / 10.0;
    var tp = [0];

    for (var i = 0; i < 3; i++) {
	var tmp = 0;
	var pwr = 1.0;
	for (var j = 0; j < 3; j++) {
	    tp = tlist[i * 3 + j];
	    var n = tnum[i * 3 + j]; // reduce terms to 1/3
//	    n = Math.min(n,6);
	    var x = 0;
	    if (j !== 0) // increase power each cycle
		pwr = pwr * u;
	    if (tp !== null) // skip nulls
	    {
		x = getterms(tp, n, u);
		x += lrg[i * 3 + j];
		x = x * pwr;
	    }
	    tmp += x;
	} // j
	pol[i] = tmp;
    } // i;
}

// calculate the moons position
function getlunar(t) {
    // printf("t: %f\n",t);
    var L, d, M, Mm, f, E, p;
    var A1, A2;
    var t2 = t * t;

    // moon mean longitude
    L = 218.31665436 + 481267.88134240 * t - 0.0013268 * t2 + 1.856e-6
	    * (t * t2);
    // moon mean elongation
    d = 297.8502042 + 445267.11151675 * t - 0.00163 * t + 1.832e-6
	    * (t * t2);
    // sun's mean anomaly
    M = 357.52910918 + 35999.05029094 * t - 0.0001536 * t2 + 0.041e-6
	    * (t * t2);
    // moon's mean anomaly
    Mm = 134.96341138 + 477198.86763133 * t + 0.0089970 * t2 + 14.348e-6
	    * (t * t2);
    // moon's argument of latitude
    f = 93.2720993 + 483202.0175273 * t - 0.0034029 * t2 - 0.284e-6
	    * (t * t2);

    E = 1.0 - 0.002516 * t - 0.0000074 * t2;

    p = 0;

    for (var i = 0; i < luntrm.length; i++) {
	// D l' l F
	var term = luntrg[i * 4] * d;
	term += luntrg[i * 4 + 1] * M;
	term += luntrg[i * 4 + 2] * Mm;
	term += luntrg[i * 4 + 3] * f;
	var x = Math.abs(luntrg[i * 4 + 1]);

	// get term as long and convert to double
	var y = (luntrm[i] * 1.0e-8);

	if (x !== 0) {
	    var e = E;
	    if (x === 2)
		e = E * E;
	    p += y * e * Math.sin(term * (Math.PI / 180));
	} else
	    p += y * Math.sin(term * (Math.PI / 180));
    }

    A1 = 119.75 + 131.849 * t;
    A2 = 53.09 + 479264.290 * t;

    p += 0.003958 * Math.sin((Math.PI / 180) * A1) + 0.001926
	    * Math.sin((Math.PI / 180) * (L - f)) + 0.000318
	    * Math.sin((Math.PI / 180) * A2);

    L += p;
    return fixangle(L);
}

function getnode(t, mean) {

    var lon = 0;
    var n = 125.0446 - 1934.13618 * t + 20.762e-4 * (t * t) + 2.139e-6
	    * (t * t * t);
    n += 1.650e-8 * (t * t * t * t);

    // these maybe could be truncated by removig terms 3 and 4 and changing formula
    for (var i = 0; i < 22; i++) {
	var x = (nodterms[i * 2 + 1] * 1e-4);
	x += nodlrg[i] * t; // already a double
//	x += (nodterms[i * 5 + 2] * 1e-7) * t * t;
	// for 1700 -> these are not needed (change to i*3 above)
//	x += (nodterms[i * 5 + 3] * 1e-9) * t * t * t;
//	x += (nodterms[i * 5 + 4] * 1e-11) * t * t * t * t;
	lon += (nodterms[i * 2] * 1e-4)
		* Math.sin(Math.PI / 180 * (x));
    }

    var phi = 125.0 - 1934.1 * t;
    var sm = 25.9 * Math.sin(Math.PI / 180 * (phi));
    phi = 220.2 - 1935.5 * t;
    sm += -4.3 * Math.sin(Math.PI / 180 * (phi));
    // sm /= 60.0;
    var ss = 0.38 * Math.sin(Math.PI / 180 * (357.5 + 35999.1 * t));
    // ss /= 3600;
    sm = 180 / Math.PI * (sm + ss * t); // * 1e-1;

    sm *= 1e-5;

    lon += sm;
    lon += n;

    mean[0] = fixangle(n);
    return fixangle(lon);
}

function hel2geo(pol, spol) {
    var L = pol[0];
    var B = pol[1];
    var R = pol[2];

    var sunL = spol[0];
    var sunB = spol[1];
    var sunR = spol[2];
    var x = R * Math.cos(B) * Math.cos(L) - sunR * Math.cos(sunB)
	    * Math.cos(sunL);
    var y = R * Math.cos(B) * Math.sin(L) - sunR * Math.cos(sunB)
	    * Math.sin(sunL);
    var lon = Math.atan2(y, x);
    if (lon < 0.0)
	lon = (Math.PI * 2) + lon;
    return lon;
}

// no ascendant used pos = 0-8
function transitPlanets(jd, pos, meanNode) {
    var pol = new Array(3);
    var spol = new Array(3);
    var lon;
    // sun
    var t = (jd - J2000) / 36525;
    var ay = getayan(t);

    getplanet(t, pol, earlrg, earptr, earterms);

    // console.log(""+fixangr(pol[0])+" "+astor(pol[1]) +" "+pol[2]);
    spol[0] = pol[0];
    spol[1] = pol[1];
    spol[2] = pol[2];

    lon = fixangle(rtd(pol[0]));

    var u = t / 100;
    // nutation
    var a1 = 2.18 - 3375.70 * u + 0.36 * u * u;
    var a2 = 3.51 + 125666.39 * u + 0.10 * u * u;
    var nu = 1.0e-7 * (-834 * Math.sin(a1) - 64 * Math.sin(a2));

    // sun abberation
    var ab = -993 + 17.0 * Math.cos(3.10 + 62830.14 * u);
    ab = ab * 0.0000001;
    lon += ab + nu;

    pos[SUN] = fixangle(ay + lon + 180.0);

    // 
// skip moon for now
    // 
    pos[MON] = fixangle(getlunar(t) + ay);

    // mercury
    getplanet(t, pol, merlrg, merptr, merterms);
    // System.out.printf("mer: %f %f %f\n",pol[0],pol[1],pol[2]);
    lon = hel2geo(pol, spol);
    ab = -1261.0 + 1485 * Math.cos(2.649 + 198048.273 * u);
    ab += 305.0 * Math.cos(5.71 + 458927.03 * u);
    ab += 230.0 * Math.cos(5.30 + 396096.55 * u);
    ab = ab * 0.0000001;
    lon += ab + nu;
    pos[MER] = fixangle(rtd(lon) + ay);

    // venus
    getplanet(t, pol, venlrg, venptr, venterms);
    lon = hel2geo(pol, spol);
    ab = -1304 + 1016 * Math.cos(1.423 + 39302.097 * u);
    ab += 224 * Math.cos(2.85 + 78604.19 * u);
    ab += 98 * Math.cos(4.27 + 117906.29 * u);
    ab *= 0.0000001;
    lon += ab + nu;
    pos[VEN] = fixangle(rtd(lon) + ay);

    // mars
    getplanet(t, pol, marlrg, marptr, marterms);
    lon = hel2geo(pol, spol);
    ab = -1052 + 877 * Math.cos(1.834 + 29424.634 * u);
    ab += +187 * Math.cos(3.67 + 58849.27 * u);
    ab += 84 * Math.cos(3.49 + 33405.34 * u);
    ab *= 0.0000001;
    lon += ab + nu;
    pos[MAR] = fixangle(rtd(lon) + ay);

    // jupiter
    getplanet(t, pol, juplrg, jupptr, jupterms);
    lon = hel2geo(pol, spol);
    ab = -527 + 978 * Math.cos(1.154 + 57533.849 * u);
    ab += 89 * Math.cos(2.30 + 115067.70 * u);
    ab += 46 * Math.cos(4.64 + 62830.76 * u);
    ab += 45 * Math.cos(0.76 + 52236.94 * u);
    ab *= 0.0000001;
    lon += ab;
    lon += nu;
    pos[JUP] = fixangle(rtd(lon) + ay);

    // saturn
    getplanet(t, pol, satlrg, satptr, satterms);
    lon = hel2geo(pol, spol);
    ab = -373 + 986 * Math.cos(0.880 + 60697.768 * u);
    ab += 54 * Math.cos(3.31 + 62830.76 * u);
    ab += 52 * Math.cos(1.59 + 58564.78 * u);
    ab += 51 * Math.cos(1.76 + 121395.54 * u);
    ab *= 0.0000001;
    lon += ab + nu;
    pos[SAT] = fixangle(rtd(lon) + ay);

    // the nodes
    var mnode = [0];
    lon = getnode(t, mnode);

    if (meanNode)lon = mnode[0];
    // console.log(lon,mnode[0],meanNode);
    pos[RAH] = fixangle(lon + ay);
    pos[KET] = fixangle(lon + 180.0 + ay);
    return lon;
}

function get_jul_day(mon,day,year){
	
	// convert date to julian
	var im = 12 * ( year + 4800) + mon - 3;
	var j = Math.floor((2*(im%12) + 7 + 365*im)/ 12);
	j += day + Math.floor(im/48) - 32083;
	if(j > 2299171) 
		j += Math.floor(im/4800) - Math.floor(im/1200) + 38;
	return j ; // julian date starts at noon so subtract .05 to get 0:00 hours
    }
    
function date2jul(mon, day, year) {
    var d = new Date(year,mon-1,day,0,0,0);
    return Math.floor(((d / 86400000) - d.getTimezoneOffset()/1440) + 2440587.5);
}


function jd2date(xjd) {
      var millis = (xjd - 2440587.5) * 86400000;
    var dateLocal = new Date(millis);
    return dateLocal.toDateString();
    // return new Date(yr, m, dy, 0, 0, 0).toDateString();
}


function jul2date(xjd) {
    var jy = (xjd - 2440587.5) * 86400000;
    var date = new Date(jy);
    var m = date.getUTCMonth() + 1;
    var d = date.getUTCDate();
    var y = date.getUTCFullYear();
    // use universal format year-month-day
    return y + "/" + m + "/" + d;
}


function fixangle(a) {
    return a - 360.0 * (Math.floor(a / 360.0));
}
;


function rtd(r) {
    return (r * 180.0) / Math.PI;
}
;

function dtr(d) {
    return (Math.PI / 180 * d);
}

function pr(v) {

    var zs = "ArTaGeCnLeViLiScSgCpAqPi";
    var d = Math.floor(v % 30);
    var m = Math.floor((v * 60) % 60);
    var z = Math.floor(v / 30);
    var s = d;
    s += zs.substr(z * 2, 2);
    if (m < 10)
	s += "0";
    s += m;
    return s;
}
