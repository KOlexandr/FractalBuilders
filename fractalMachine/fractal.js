var fractal = (function () {
    var module = {}, zoomlevel = 4,
        zoom = Math.pow(1.25, zoomlevel), c, ctx, height, width;

    module.init = function () {
        c = document.getElementById("main");

        c.addEventListener("mousewheel", fractal.zoom, false);
        c.addEventListener("DOMMouseScroll", fractal.zoom, false);

        ctx = c.getContext("2d");
        fractal.angle = makeSlider({steps: 360 / 5, step: 60 / 5, id: "angle"});
        fractal.skewangle = makeSlider({steps: 180 / 5, step: 90 / 5, id: "skewangle"});
        fractal.poly = makeThumb({steps: 6, step: 0, id: "poly"});
        fractal.segments = makeThumb({steps: 5, step: 0, id: "segments"});
        fractal.mirror = makeThumb({steps: 2, step: 0, id: "mirror"});

        fractal.angle.unlock();

        fractal.arms = makeThumb({steps: 2, step: 0, id: "arms"});
        fractal.depth = makeThumb({steps: 5, step: 0, id: "depth"});

        window.requestAnimFrame = (function () {
            return window.requestAnimationFrame ||
                window.webkitRequestAnimationFrame ||
                window.mozRequestAnimationFrame ||
                function (callback) {
                    window.setTimeout(callback, 1000 / 60);
                };
        })();

        fractal.angle.fix = function () {
            //this function changes steps to match the number of degrees required to do a full loop.
            //this code is ugly, but i can't be bothered fixing it right now, I have to go to a party.
            var segments = (fractal.segments.step + 1);
            var loopat360 = (2 / (fractal.segments.step + 1));
            var i = 1;
            this.steps = 360 / 5;
            while (Math.abs(loopat360 * i % 1) > 0.1) {
                i++;
            }
            this.steps = 360 / 5 * i;

            var skew = fractal.skewangle.step - fractal.skewangle.steps / 2;
            fractal.skewangle.steps = 180 / 5 * segments;
            if (fractal.arms.step) {
                fractal.skewangle.steps *= 2;
                if (segments % 2 === 0) {
                    fractal.angle.steps *= 2;
                }
            }

            if (this.step > this.steps) {
                this.step = this.steps;
            }
            if (Math.abs(skew) > fractal.skewangle.steps / 2) {
                fractal.skewangle.step = (fractal.skewangle.step + fractal.skewangle.steps / 2) % fractal.skewangle.steps;
            } else {
                fractal.skewangle.step = fractal.skewangle.steps / 2 + skew;
            }
            fractal.angle.update(this.step, 0, 1);
            fractal.skewangle.update(fractal.skewangle.step, 0, 1);
        };

        fractal.skewangle.updateLabel = function () {
            this.label.innerHTML = Math.round((this.step - this.steps / 2) * 5);
        };
        fractal.skewangle.updateLabel();

        if (window.location.hash != 0) {
            fractal.hash.load();
        }
        fractal.fixsize();

        document.onkeydown = function (e) {
            //console.log(e.keyCode)
            if (e.keyCode == 27) {
                //esc
                fractal.controls();
            } else if (e.keyCode == 46) {
                //delete
                fractal.controls();
            } else if (e.keyCode == 13) {
                //enter
                fractal.animate.toggle();
            } else if (e.keyCode == 38) {
                //up
                fractal.drag.nudge.start(0);
            } else if (e.keyCode == 40) {
                //down
                fractal.drag.nudge.start(1);
            } else if (e.keyCode == 61) {
                //+
                fractal.zoomnudge(1);
            } else if (e.keyCode == 173) {
                //-
                fractal.zoomnudge(-1);
            }
        };

        document.onkeyup = function (e) {
            if (e.keyCode == 38) {
                //up
                fractal.drag.nudge.stop(0);
            } else if (e.keyCode == 40) {
                //down
                fractal.drag.nudge.stop(1);
            }
        };

        document.onkeypress = function (e) {
            if (e.charCode == 104) {
                //h
                fractal.controls();
            } else if (e.charCode == 96) {
                //h
                fractal.controls();
            } else if (e.charCode == 113) {
                //q
                fractal.poly.up(1);
            } else if (e.charCode == 119) {
                //w
                fractal.segments.up(1);
            } else if (e.charCode == 101) {
                //e
                fractal.mirror.up(1);
            } else if (e.charCode == 114) {
                //r
                fractal.arms.up(1);
            } else if (e.charCode == 116) {
                //t
                fractal.depth.up(1);
            } else if (e.charCode == 32) {
                //space
                fractal.animate.toggle();
            } else if (e.charCode == 97) {
                //a
                fractal.poly.down();
            } else if (e.charCode == 115) {
                //s
                fractal.segments.down();
            } else if (e.charCode == 100) {
                //d
                fractal.mirror.down();
            } else if (e.charCode == 102) {
                //f
                fractal.arms.down();
            } else if (e.charCode == 103) {
                //g
                fractal.depth.down();
            } else if (e.charCode == 122) {
                //z
                fractal.reset();
            } else if (e.charCode == 120) {
                //x
                fractal.random();
            } else if (e.charCode == 99) {
                //c
                fractal.animate.toggle();
            } else if (e.charCode == 98) {
                //b
                fractal.trails.toggle();
            } else if (e.charCode == 49) {
                //1
                fractal.angle.locktoggle();
            } else if (e.charCode == 50) {
                //2
                fractal.skewangle.locktoggle();
            }
        };
    };

    var clear = function () {
        ctx.globalCompositeOperation = "source-over";
        ctx.fillRect(0, 0, width, height);
        fractal.hash.save();
    };

    module.fixsize = function () {
        width = 1100;
        height = 600;
        c.width = width;
        c.height = height;
        ctx.fillStyle = "white";
        ctx.lineWidth = 0.5;
        fractal.angle.resize();
        fractal.skewangle.resize();
        clear();
        fractal.al.render();
    };

    module.reset = function () {
        fractal.angle.update(12);
        fractal.depth.update(0);
        fractal.segments.update(0);
        fractal.arms.update(0);
        fractal.skewangle.update(90 / 5);
        fractal.mirror.update(0);
        fractal.poly.update(0);
        if (fractal.animate.on) {
            fractal.animate.toggle();
        }
        clear();
        fractal.al.render();
    };

    module.random = function () {
        fractal.angle.random();
        fractal.skewangle.random();
        fractal.depth.update(Math.floor(Math.random() * 2));
        fractal.segments.random();
        fractal.mirror.random();
        fractal.poly.random();
        fractal.arms.random();
        clear();
        fractal.al.render();
    };

    module.trails = (function () {
        var module = {}, button;
        module.on = false;
        module.toggle = function () {
            button = button || document.getElementById("trailsbutton");
            if (this.on) {
                this.on = false;
                ctx.globalCompositeOperation = "source-over";
                button.className = ("button");
                fractal.al.render();
            } else {
                this.on = true;
                button.className = ("buttonon");
            }
        };
        return module;
    }());

    module.animate = (function () {
        var module = {}, button;
        module.on = false;
        module.disabled = false;
        module.toggle = function () {
            button = button || document.getElementById("animatebutton");
            if (this.on) {
                this.on = false;
                fractal.hash.save();
                button.className = ("button");
            } else {
                if (!fractal.angle.locked || !fractal.skewangle.locked) {
                    this.on = true;
                    button.className = ("buttonon");
                    module.loop();
                }
            }
        };

        module.loop = function () {
            if (module.on) {
                window.setTimeout(module.loop, 1000 / 30);
                //requestAnimFrame(module.loop);
                fractal.angle.nudge(1 / 2);
                fractal.skewangle.nudge(1 / 5);
                if (fractal.auto.on) {
                    fractal.auto.frame();
                }
                fractal.al.render();
            }
        };

        module.disable = function () {
            button = button || document.getElementById("animatebutton");
            button.className = ("buttongrey");
            module.disabled = true;
        };
        module.enable = function () {
            button.className = ("button");
            module.disabled = false;
        };
        return module;
    }());

    module.auto = (function () {
        var module = {},
            pre,
            count,
            changes,
            mode,
            button,
            nextchange;
        module.on = false;
        module.toggle = function () {
            button = button || document.getElementById("autobutton");
            if (this.on) {
                this.on = false;
                //if (fractal.animate.on){
                //	fractal.animate.toggle();
                //}
                fractal.hash.save();
                button.className = ("button");
            } else {
                this.on = true;
                count = 0;
                symmetrystart();
                if (!fractal.animate.on) {
                    fractal.animate.toggle();
                }
                button.className = ("buttonon");
            }
        };

        module.frame = function () {
            count++;
            if (mode === "smooth") {
                if (fractal.angle.step === 0) {
                    changes++;
                    fractal.segments.random();
                    fractal.mirror.random();
                    fractal.depth.update(Math.floor(Math.random() * 2));
                    if (changes === 8) {
                        if (Math.floor(Math.random() * 4)) {
                            rapidstart();
                        } else {
                            symmetrystart();
                        }
                    }
                }
            }
            if (mode === "rapid") {
                if (count === lastchange + nextchange) {
                    lastchange = count;
                    fractal.random();
                    pre -= 1;
                    nextchange = Math.floor(Math.pow(1.04, pre));
                    if (nextchange === 0) {
                        if (ones) {
                            nextchange = 1;
                            ones--;
                        } else {
                            if (Math.floor(Math.random() * 2)) {
                                smoothstart();
                            } else {
                                longstart();
                            }
                        }
                    }
                }
            }
            if (mode === "symmetry") {
                if (count === lastchange + nextchange) {
                    lastchange = count;
                    clear();
                    fractal.angle.random();
                    fractal.segments.random();
                    fractal.mirror.random();
                    fractal.poly.random();
                    if (fractal.mirror.step) {
                        fractal.arms.random();
                    }
                    else {
                        fractal.arms.update(0);
                    }
                    fractal.depth.update(Math.floor(Math.random() * 2));
                    fractal.skewangle.update(fractal.skewangle.steps / 2);
                    pre -= 1;
                    nextchange = Math.floor(Math.pow(1.04, pre));
                    //console.log(nextchange);
                    if (nextchange === 0) {
                        if (ones) {
                            nextchange = 1;
                            ones--;
                        } else {
                            if (Math.floor(Math.random() * 2)) {
                                smoothstart();
                            }
                            else {
                                longstart();
                            }
                        }
                    }
                }
            }
            if (mode === "long") {
                if (count === lastchange + nextchange) {
                    if (Math.floor(Math.random() * 4)) {
                        rapidstart();
                    } else {
                        symmetrystart();
                    }
                }
            }
        };

        //smoothmode
        var smoothstart = function () {
            if (Math.floor(Math.random() * 2)) {
                fractal.trails.toggle();
            }
            mode = "smooth";
            changes = 0;
            fractal.poly.random();
            fractal.angle.unlock();
            fractal.skewangle.lock();
            fractal.skewangle.update(fractal.skewangle.steps / 2);
            fractal.arms.update(0);
        };

        //rapidmode
        var rapidstart = function () {
            ones = 20;
            if (!fractal.trails.on) {
                fractal.trails.toggle();
            }
            mode = "rapid";
            nextchange = 1;
            lastchange = count;
            pre = 128;
            fractal.angle.unlock();
            fractal.skewangle.unlock();
            fractal.random();
        };
        var symmetrystart = function () {
            ones = 20;
            if (!fractal.trails.on) {
                fractal.trails.toggle();
            }
            mode = "symmetry";
            nextchange = 1;
            lastchange = count;
            pre = 128;
            fractal.angle.unlock();
            fractal.skewangle.lock();
            fractal.random();
            fractal.skewangle.update(fractal.skewangle.steps / 2);
        };

        //longmode
        var longstart = function () {
            if (Math.floor(Math.random() * 2)) {
                fractal.trails.toggle();
            }
            mode = "long";
            lastchange = count;
            nextchange = 2048;
            fractal.angle.unlock();
            fractal.skewangle.unlock();
            fractal.random();
        };

        return module;
    }());

    module.controls = function () {
        var controlbox = document.getElementById("controls");
        var homelink = document.getElementById("homediv");
        if (controlbox.className === "controls") {
            homelink.className = "hidden";
            controlbox.className = "hidden";
        } else {
            controlbox.className = "controls";
            fractal.angle.resize();
            fractal.skewangle.resize();
            homelink.className = "homediv";
        }
    };

    module.drag = (function () {
        var module = {};
        var mposy;
        module.offset = 0;
        module.held = false;
        var moved = false;

        module.down = function (e) {
            mposy = e.clientY;
            document.onmouseup = function () {
                return function (event) {
                    module.up(event)
                }
            }();
            document.onmouseout = function () {
                return function (event) {
                    module.out(event)
                }
            }();

            document.onmousemove = function () {
                return function (event) {
                    module.move(event)
                }
            }();
            module.held = true;
            module.loop();
            e.stopPropagation();
        };

        module.out = function (e) {
            if (e.relatedTarget == null) {
                stopdrag(e);
            }
        };
        module.up = function () {
            document.onmouseout = [];
            document.onmouseout = [];
            document.onmousemove = [];
            module.held = false;
        };
        module.move = function (e) {
            var diffy = e.clientY - mposy;
            module.offset -= diffy;
            //fractal.al.render();
            mposy = e.clientY;
            moved = true;
        };

        module.loop = function () {
            if (module.held) {
                if (moved && !fractal.animate.on) {
                    fractal.al.render();
                    moved = false;
                }
                requestAnimFrame(module.loop);
            }
        };

        module.nudge = (function () {
            var module = {};
            module.down = false;
            module.direction = 0;
            module.loop = function () {
                if (module.down) {
                    if (module.direction) {
                        fractal.drag.offset -= 5;
                    } else {
                        fractal.drag.offset += 5;
                    }
                    if (!fractal.animate.on) {
                        fractal.al.render();
                    }
                    requestAnimFrame(module.loop);
                }
            };

            module.start = function (direction) {
                module.direction = direction;
                if (!module.down) {
                    module.down = true;
                    module.loop();
                }
            };

            module.stop = function () {
                module.down = false;
            };

            return module;
        }());

        return module;
    }());

    module.zoom = function (e) {
        var delta = Math.max(-1, Math.min(1, (e.wheelDelta || (0 - e.detail))));
        fractal.zoomnudge(delta);
    };

    module.zoomnudge = function (delta) {
        zoomlevel -= delta;
        zoom = Math.pow(1.25, zoomlevel);
        if (zoom < 1) {
            zoomlevel = 1;
            zoom = 1;
        }
        fractal.al.render();
    };

    module.hash = (function () {
        var module = {};
        module.save = function () {
            var ruleid = "#" +
                (('000' + (Math.round(fractal.angle.step * 5))).substr(-4)) + "," +
                ('000' + (Math.round(fractal.skewangle.step * 5))).substr(-4) + "," +
                (fractal.poly.step + 1) + "," +
                (fractal.segments.step + 1) + "," +
                fractal.mirror.step + "," +
                fractal.arms.step + "," +
                (fractal.depth.step + 1);
            module.current = ruleid;
            window.location = String(window.location).replace(/\#.*$/, "") + ruleid;
        };

        module.load = function () {
            if (window.location.hash != 0) {
                if (window.location.hash !== module.current) {
                    var ruleid = window.location.hash;
                    if (ruleid.length === 14) {
                        fractal.depth.update(ruleid.charAt(6) - 1);
                        fractal.poly.update(ruleid.charAt(8) - 1);
                        fractal.segments.update((ruleid.charAt(10) + ruleid.charAt(11)) - 4);
                        fractal.angle.fix();
                        fractal.angle.update((ruleid.charAt(1) + ruleid.charAt(2) + ruleid.charAt(3) + ruleid.charAt(4)) / 5);
                        fractal.mirror.update(ruleid.charAt(13) - 0);
                        fractal.arms.update(0);
                        fractal.skewangle.update(fractal.skewangle.steps / 2);
                        fractal.al.render();
                    } else {
                        fractal.poly.update(ruleid.charAt(11) - 1);
                        fractal.segments.update(ruleid.charAt(13) - 1);
                        fractal.mirror.update(ruleid.charAt(15) - 0);
                        fractal.arms.update(ruleid.charAt(17) - 0);
                        fractal.depth.update(ruleid.charAt(19) - 1);
                        fractal.angle.fix();
                        fractal.angle.update((ruleid.charAt(1) + ruleid.charAt(2) + ruleid.charAt(3) + ruleid.charAt(4)) / 5);
                        fractal.skewangle.update((ruleid.charAt(6) + ruleid.charAt(7) + ruleid.charAt(8) + ruleid.charAt(9)) / 5);
                        fractal.al.render();
                    }
                }
            }
        };
        window.onhashchange = module.load;
        return module;
    }());

    module.al = (function () {
        var module = {},
            heading,
            unit,
            x,
            y,
            rads,
            depth,
            segments,
            mirror,
            poly,
            arms,
            motifLines,
            segrad,
            lastrad,
            sideLines;

        var prepare = function prepare() {
            depth = fractal.depth.step + 1;
            mirror = fractal.mirror.step;
            segments = fractal.segments.step + 1;
            poly = fractal.poly.step + 1;
            arms = fractal.arms.step;
            rads = fractal.angle.step * 5 * (Math.PI / 180);

            if (!fractal.trails.on) {
                ctx.fillRect(0, 0, width, height);
            }
            //this code below is a bit of a mess, but it works.
            var skewrad = (fractal.angle.step - fractal.skewangle.step + fractal.skewangle.steps / 2) * 5 * (Math.PI / 180);

            segrad = skewrad * 2 / segments;
            lastrad = skewrad * 2 - rads;

            var motifTestWidth = 2 + Math.cos(rads);
            var motifTestHeight = Math.sin(rads);
            var motifHeading = rads;
            var motifWidth;
            var motifMax;

            for (i = 0; i < segments; i++) {
                motifHeading -= (segrad);
                motifTestWidth += Math.cos(motifHeading);
                motifTestHeight += Math.sin(motifHeading);
            }
            //if the correction is zero, it doesn't work. so i need the default zero.
            var skewCorrection = Math.atan2(motifTestHeight, motifTestWidth) || 0;
            //now test for the highest/lowest the line gets after skew correction is applied. if it is too much i change the way the shape renders.
            var testline = function () {
                motifTestWidth += Math.cos(motifHeading);
                motifTestHeight += Math.sin(motifHeading);
                motifMax = Math.max(motifMax, Math.abs(motifTestHeight));
            };

            motifHeading = skewCorrection;
            motifTestWidth = Math.cos(motifHeading);
            motifTestHeight = Math.sin(motifHeading);
            motifMax = Math.abs(motifTestHeight);

            motifHeading -= rads;
            testline();

            for (i = 0; i < segments; i++) {
                motifHeading += (segrad);
                testline();
            }
            motifHeading = skewCorrection;
            testline();

            motifWidth = Math.abs(motifTestWidth);

            var gap;
            if (motifWidth > 0.98) {
                //the default(I would use 1, but i want some leeway to make up for floating point weirdness).
                unit = width / zoom / Math.abs(Math.pow(motifWidth, depth));
                gap = width / zoom;

            } else {
                //the fractal turns in on itself, so the start and end points won't be the limits of the shape.
                unit = Math.abs(width / zoom / (motifWidth - Math.cos(skewCorrection) * 2));
                gap = unit * Math.pow(motifWidth, depth);
            }

            var shrinkray;
            if (motifMax * unit > width / zoom / 2) {
                //the motif sticks out too much, so the shape should be shrunk.
                shrinkray = (width / zoom / 2) / (motifMax * unit);
                unit = unit * shrinkray;
                gap = gap * shrinkray;
            }

            var polyRads;
            var polyOffset = 0;
            if (poly > 2) {
                //the fractal is a polygon, so it must be offset and resized accordingly
                polyRads = Math.PI / poly;
                polyOffset = (gap / 2) / Math.tan(polyRads);
                if ((polyOffset * 2) > width / zoom) {
                    shrinkray = ((polyOffset * 2) / (width / zoom));
                    unit = unit / shrinkray;
                    gap = gap / shrinkray;
                    polyOffset = polyOffset / shrinkray;
                }
            }

            //the fractal turns as it starts, so i have to act like it's just finished a polygon side. The skews have to stack with every iteration.
            heading = (skewCorrection * depth - (Math.PI * 2) / poly);

            x = width / 2 - (gap / 2);
            y = height / 2 - polyOffset - fractal.drag.offset;

            motifLines = 3 + segments;
            if (mirror) {
                motifLines += 1 + segments;
            }
            if (arms) {
                motifLines += segments * (mirror + 1);
            }
            sideLines = Math.pow(motifLines, depth);
        };

        var i, snaps = [], armSnaps = [];
        var starttime;

        module.render = function render() {
            prepare();
            if (!fractal.animate.on && (!fractal.angle.held && !fractal.skewangle.held)) {
                fractal.hash.save();
            }
            i = 0;
            //little box at the start to help debug
            //ctx.fillStyle="#000000";
            //ctx.fillRect(x,y,10,10);
            //ctx.fillStyle="#ffffff";
            ctx.beginPath();
            ctx.moveTo(x, y);
            module.morelines();
        };

        module.morelines = function morelines() {
            var turnDepth = 0;
            starttime = Date.now();

            var saveSnap = function savesnap() {
                var outward = {x: x, y: y, heading: heading};
                outward.load = function () {
                    x = this.x;
                    y = this.y;
                    heading = this.heading;
                    ctx.moveTo(x, y);
                };
                return outward;
            };

            var turn = function turn() {
                var count = i / Math.pow(motifLines, turnDepth) % motifLines;
                if (i % sideLines === 0) {
                    heading += (Math.PI * 2) / poly;
                } else if (count === 0) {
                    turnDepth += 1;
                    turn();
                    turnDepth -= 1;
                } else if (count === 1) {
                    if (mirror) {
                        snaps[turnDepth] = saveSnap();
                    }
                    heading += -rads;
                } else if (count < 2 + segments * (arms + 1)) {
                    if (arms) {
                        if (count % 2 === 1) {
                            armSnaps[turnDepth].load();
                            heading += segrad;
                        } else {
                            armSnaps[turnDepth] = saveSnap();
                            heading -= (Math.PI - segrad) / 2;
                        }
                    } else {
                        heading += segrad;
                    }
                } else if (count === 2 + segments * (arms + 1)) {
                    //last turn if mirror is off, otherwise do the snap
                    if (mirror) {
                        snaps[turnDepth].load();
                        heading += lastrad;
                    } else {
                        heading += -lastrad;
                    }
                } else if (count < motifLines - 1) {
                    if (arms) {
                        if (count % 2 === 0) {
                            armSnaps[turnDepth].load();
                            heading -= segrad;
                        } else {
                            armSnaps[turnDepth] = saveSnap();
                            heading += (Math.PI - segrad) / 2;
                        }
                    } else {
                        heading -= segrad;
                    }
                } else if (count === motifLines - 1) {
                    //this is the last turn, but is only reached when mirror is on
                    heading += rads;
                }
            };

            while (i < sideLines * poly) {
                //check if we need a break after a certain number of lines (can be raised);
                if (i % 256 === 0) {
                    ctx.stroke();
                    ctx.beginPath();
                    ctx.moveTo(x, y);
                    if (Date.now() - starttime > 50) {
                        if (fractal.auto.on) {
                            fractal.random();
                        } else if (fractal.animate.on) {
                            fractal.animate.toggle();
                        }
                        requestAnimFrame(fractal.al.morelines);
                        break;
                    } else {
                        turn();
                        x += unit * Math.cos(heading);
                        y += unit * Math.sin(heading);
                        ctx.lineTo(x, y);
                        i++
                    }
                } else {
                    turn();
                    x += unit * Math.cos(heading);
                    y += unit * Math.sin(heading);
                    ctx.lineTo(x, y);
                    i++
                }
            }
            if (i === sideLines * poly) {
                ctx.stroke();
            }
        };
        return module;
    }());

    var makeSlider = function (spec) {
        var outward = {};
        outward.held = false;
        outward.element = document.getElementById(spec.id);
        outward.steps = spec.steps;

        outward.resize = function () {
            outward.range = outward.element.parentNode.clientWidth - outward.element.clientWidth;
            outward.start = outward.element.parentNode.getBoundingClientRect().left;
        };
        outward.resize();

        outward.label = document.getElementById("l" + spec.id);

        outward.update = function (step, clicked, fixed) {
            if (outward.step != step || fixed) {
                outward.step = step;
                var sliderx = step * (outward.range / outward.steps);
                outward.element.style.left = sliderx + "px";
                outward.updateLabel();
                if (clicked) {
                    if (fractal.animate.on) {
                        outward.lock();
                    }
                    fractal.al.render();
                }
            }
        };

        outward.random = function () {
            outward.update(Math.floor(Math.random() * outward.steps));
        };

        outward.updateLabel = function () {
            outward.label.innerHTML = Math.round(outward.step * 5);
        };
        outward.down = function (e) {
            e.preventDefault();
            outward.held = true;
            var where = this;
            document.onmouseup = function () {
                return function (event) {
                    where.stop(event)
                }
            }();
            document.onmouseout = function () {
                return function (event) {
                    where.out(event)
                }
            }();

            document.onmousemove = function () {
                return function (event) {
                    where.move(event)
                }
            }();
            outward.element.className = "sliderdown";
            e.stopPropagation();
        };
        outward.stop = function (e) {
            if (outward.held === true) {
                document.onmouseout = [];
                document.onmouseout = [];
                document.onmousemove = [];
                outward.element.className = "slider";
                outward.held = false;
                fractal.hash.save();
            }
        };
        outward.out = function (e) {
            if (e.relatedTarget == null) {
                outward.stop(e);
            }
        };
        var getx = function (mpos) {
            var slidermousepos;
            if ((mpos) < outward.start + (outward.element.clientWidth / 2)) {
                slidermousepos = 0;
            } else if (mpos > outward.start + outward.range + (outward.element.clientWidth / 2)) {
                slidermousepos = outward.range;
            } else {
                slidermousepos = (mpos - outward.start - (outward.element.clientWidth / 2));
            }
            return slidermousepos;
        };
        outward.move = function (e) {
            var step = Math.round(getx(e.clientX) / (outward.range / outward.steps));
            outward.update(step, true);
        };
        outward.jump = function (e) {
            outward.move(e);
            outward.down(e);
        };

        outward.nudge = function (amount) {
            //move by a small amount (for animating)
            if (!outward.locked) {
                var next = this.step + amount;
                if (this.step > this.steps - amount) {
                    next = 0;
                }
                this.update(next);
            }
        };

        var lockbutton = document.getElementById(spec.id + "lock");
        outward.locked = true;
        outward.locktoggle = function () {
            if (outward.locked) {
                outward.unlock();
            } else {
                outward.lock();
            }
        };
        outward.lock = function () {
            outward.locked = true;
            lockbutton.className = "button";
            if (fractal.angle.locked && fractal.skewangle.locked) {
                if (fractal.animate.on) {
                    fractal.animate.toggle();
                }
                if (fractal.auto.on) {
                    fractal.auto.toggle();
                }
                fractal.animate.disable();
            }
        };
        outward.unlock = function () {
            outward.locked = false;
            lockbutton.className = "buttonon";
            if (fractal.animate.disabled) {
                fractal.animate.enable();
                fractal.animate.toggle();
            }
        };
        outward.highlight = function (state) {
            if (state) {
                outward.element.className = "sliderdown";
            }
            else {
                outward.element.className = "slider";
            }
        };

        outward.step = spec.step;
        outward.element.style.left = outward.step * (outward.range / outward.steps) + "px";
        outward.label.innerHTML = outward.step * 5;

        return outward;
    };

    var makeThumb = function (spec) {
        var outward = {}, area, c, ctx, d, icon, cCell, over = false;

        area = document.getElementById("thumbarea");
        c = document.createElement("canvas");
        c.className = "thumbcanvas";
        c.width = 56;
        c.height = 56;
        c.onclick = function () {
            outward.up(true);
        };
        ctx = c.getContext("2d");
        ctx.fillStyle = "#ffffff";
        ctx.lineWidth = 2;

        d = document.createElement("div");
        icon = document.createElement("div");

        d.onclick = function () {
            outward.down();
        };
        c.onmouseover = function () {
            outward.hover();
        };
        c.onmouseout = function () {
            over = false;
            outward.render();
        };

        cCell = document.createElement("td");

        area.appendChild(cCell);

        cCell.appendChild(c);
        cCell.appendChild(d);
        d.appendChild(icon);

        outward.steps = spec.steps;
        outward.step = spec.step;
        outward.id = spec.id;

        outward.render = function () {
            if (!over) {
                ctx.fillRect(0, 0, c.width, c.height);
            } else {
                ctx.fillStyle = "#aaaaaa";
                ctx.fillRect(0, 0, c.width, c.height);
                ctx.fillStyle = "#ffffff";
            }
            if (renders[this.id]) {
                renders[this.id](outward.step);
            }
        };
        outward.hover = function () {
            over = true;
            ctx.fillStyle = "#aaaaaa";
            ctx.fillRect(0, 0, c.width, c.height);
            ctx.fillStyle = "#ffffff";
            if (renders[this.id]) {
                renders[this.id]((outward.step + 1) % outward.steps);
            }
        };
        outward.up = function (loop) {
            if (this.step !== this.steps - 1) {
                this.update(this.step + 1);
            } else if (loop) {
                this.update(0);
            }
            fractal.al.render();
        };
        outward.down = function () {
            if (this.step !== 0) {
                this.update(this.step - 1);
            }
            fractal.al.render();
        };
        outward.update = function (step) {
            this.step = step;
            this.render();
            if (this.id === "segments" || this.id === "arms") {
                fractal.angle.fix();
            }
        };
        outward.random = function () {
            outward.update(Math.floor(Math.random() * outward.steps));
        };
        outward.hide = function (setting) {
            if (setting) {
                cCell.className = "";
            } else {
                cCell.className = "hidden";
            }
        };

        var renders = {};
        renders.mirror = function (step) {
            var topmost = c.width / 3 * Math.cos(60 * (Math.PI / 180));
            ctx.beginPath();
            ctx.moveTo(0, c.height / 2);
            ctx.lineTo(c.width / 3, c.height / 2);
            ctx.lineTo(c.width / 2, topmost);
            ctx.lineTo(c.width * 2 / 3, c.height / 2);
            if (step) {
                ctx.moveTo(c.width / 3, c.height / 2);
                ctx.lineTo(c.width / 2, c.height - topmost);
                ctx.lineTo(c.width * 2 / 3, c.height / 2);
            }
            ctx.lineTo(c.width, c.height / 2);
            ctx.stroke();
        };
        renders.poly = function (step) {
            var length = c.width * 2 / 3,
                polyOffset = (length / 2) / Math.tan(180 / (step + 1) * (Math.PI / 180)),
                x,
                y,
                heading = 360 / (step + 1) * -1,
                radians,
                shrinkray;

            if (step === 0) {
                polyOffset = 0;
            }

            if ((polyOffset * 2) > length) {
                shrinkray = (polyOffset * 2 / length);
                length = length / shrinkray;
                polyOffset = polyOffset / shrinkray;
            }
            x = (c.width - length) / 2;
            y = c.height / 2 - polyOffset;

            if (step === 1) {
                ctx.beginPath();
                ctx.moveTo(x, y - 2);
                ctx.lineTo(x + length, y - 2);
                ctx.moveTo(x, y + 2);
                ctx.lineTo(x + length, y + 2);
                ctx.stroke();
            } else {
                ctx.beginPath();
                ctx.moveTo(x, y);
                for (i = 0; i < (step + 1); i++) {
                    heading += 360 / (step + 1);
                    radians = heading * (Math.PI / 180);
                    x += length * Math.cos(radians);
                    y += length * Math.sin(radians);
                    ctx.lineTo(x, y);
                }
                ctx.stroke();
            }
        };
        renders.segments = function (step) {
            function oneline() {
                x += length * Math.cos(heading);
                y += length * Math.sin(heading);
                ctx.lineTo(x, y);
            }

            var length,
                x = 0,
                y = c.height / 2,
                heading,
                rad = 60 * Math.PI / 180;

            var lengthinunits = 2 + Math.cos(rad);
            heading = -rad;
            for (i = 0; i < step + 1; i++) {
                heading += (rad * 2 / (step + 1));
                lengthinunits += Math.cos(heading);
            }

            length = c.width / lengthinunits;
            heading = 0;
            ctx.beginPath();
            ctx.moveTo(x, y);
            oneline();
            heading += -rad;
            oneline();
            for (var i = 0; i < step + 1; i++) {
                heading += rad * 2 / (step + 1);
                oneline();
            }
            heading += -rad;
            oneline();
            ctx.stroke();

        };
        renders.arms = function (step) {
            var topmost = c.width / 3 * Math.cos(60 * (Math.PI / 180));
            ctx.beginPath();
            ctx.moveTo(0, c.height / 2);
            ctx.lineTo(c.width / 3, c.height / 2);
            ctx.lineTo(c.width / 2, topmost);
            ctx.lineTo(c.width * 2 / 3, c.height / 2);
            ctx.lineTo(c.width, c.height / 2);
            if (step) {
                ctx.moveTo(c.width / 2, topmost);
                ctx.lineTo(c.width / 2, topmost - c.height / 3);
            }
            ctx.stroke();
        };
        renders.depth = function (step) {
            var heading = 0;

            function recursivedraw(rads, localdepth) {
                heading = heading + rads;
                if (localdepth === 0) {
                    //this is for when the fractal is at the bottom level and actually has to draw a line.
                    x += length * Math.cos(heading);
                    y += length * Math.sin(heading);
                    ctx.lineTo(x, y);
                } else {
                    recursivedraw(0, localdepth - 1);
                    recursivedraw(-rad, localdepth - 1);
                    recursivedraw(rad * 2, localdepth - 1);
                    recursivedraw(-rad, localdepth - 1);
                }
            }

            var x = 0;
            var y = c.height / 2;
            var rad = 60 * Math.PI / 180;
            var length = c.width / (Math.pow(3, step + 1));

            ctx.beginPath();
            ctx.moveTo(x, y);
            recursivedraw(0, step + 1);
            ctx.stroke();
        };

        outward.render();
        return outward;
    };
    return module;
}());