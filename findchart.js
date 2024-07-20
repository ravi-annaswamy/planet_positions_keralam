       let zod = [0, 0, 0, 0, 0, 0, 0, 0, 0];
        // zod.push[]
        function showSign(sgn) {
            var idx = document.getElementById("planetsid").selectedIndex;
            zod[idx] = sgn;
            // console.log(zod);
            if (idx == 7) {
                var k = Number(zod[idx]) + 6;
                if (k > 12) k -= 12;
                if (k < 0) k += 12;
                zod[8] = k;
            }
            // document.getElementById(sgn).innerText = idx;
            // update
            // clear
            for (var i = 0; i < 12; i++) {
                document.getElementById(i + 1).innerText = "";
            }
            var sel = document.getElementById("planetsid");
            var cnt = 0;
            for (var i = 0; i < 12; i++) {
                // add column 1
                var s = "";
                for (var j = 0; j < 9; j++) {
                    if (zod[j] == i+1) {
                        cnt++;
                        if (j == 8)
                            s += "Ket\t";
                        else
                            s += sel.options[j].text + '\t'; // + '\n';
                        if (cnt % 2 == 0) s += '\n';
                    }
                }
                document.getElementById(i+1).innerText = s;
            }
        }

        function remPlanet() {
            var e = document.getElementById("planetsid");
            var idx = e.selectedIndex;
            zod[idx] = 0;
            if (idx == 7) zod[8] = 0;
            var cnt = 0;
            for (var i = 0; i < 12; i++) {
                // add column 1
                var s = "";
                for (var j = 0; j < 9; j++) {
                    if (zod[j] == i + 1) {
                        cnt++;
                        if (j == 8)
                            s += "Ket\t";
                        else
                            s += e.options[j].text + '\t'; // + '\n';
                        if (cnt % 2 == 0) s += '\n';
                    }
                }
                document.getElementById(i + 1).innerText = s;
            }
        }

        function searchEphem() {
            var x = 0;
            for (var i = 0; i < zod.length; i++) {
                x += Number(zod[i]);
            }
            if (x == 0) {
                document.getElementById("res").innerHTML = "Please enter at least one planet";
            } else {
                // document.getElementById("res").innerHTML = "Searching...";
                var mn = document.getElementById("nodechk");
                var jd = date2jul(1, 1, 1100);
                var jd2 = date2jul(1, 1, 2000);
                var pp = new Array(10);
                var s = "";
                for (var x = jd; x <= jd2; x++) {
                    transitPlanets(x, pp, mn.checked); // planets has been changed to transplanets (transit) with no ascendant in pp
                    if (plCompare(zod, chPlanets(pp))) {
                        s += "Match: " + jd2date(x) + "<br>";
                    }
                }
                if (s == "") s = "No Matches";
                document.getElementById("res").innerHTML = s;
            }
        }

        function plCompare(pos, pp) {
            for (i = 0; i < 9; i++) {
                if (pos[i] == 0) continue;
                if (pp[i] != pos[i]) return false;
            }
            return true;
        }

        function chPlanets(p) {
            var sg = new Array(10);
            for (i = 0; i < 10; i++) {
                sg[i] = parseInt(Math.floor(p[i]) / 30) + 1;
            }
            return sg;
        }

