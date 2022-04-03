
function prepare_bg() {
    img = g_picker_img;
    for (let i = 0; i < canvas_width; i++) {
        for (let j = 0; j < canvas_height; j++) {
            pos = j * canvas_width * 4 + i * 4;
            pixel = get_pixel(i, j);
            if (pixel) {
                img.data[pos] = pixel[0];
                img.data[pos+1] = pixel[1];
                img.data[pos+2] = pixel[2];
                img.data[pos+3] = 255;
            } else {
                img.data[pos] = 255;
                img.data[pos+1] = 255;
                img.data[pos+2] = 255;
                img.data[pos+3] = 0;
            }
        }
    }
}

//function redraw(pos) {
//    var c = document.getElementById("picker")
//    var ctx = document.getElementById("picker").getContext("2d")
//
//    ctx.putImageData(img, 0, 0)
//
//   ctx.beginPath();
//   ctx.arc(canvas_size/2, canvas_size/2, canvas_size/2, 0, 2*Math.PI);
//   ctx.stroke();
//
//    ctx.beginPath();
//    if (pos) {
//        ctx.arc(pos[0], pos[1], 5, 0, 2*Math.PI);
//    }
//    ctx.stroke();
//
//}

//function get_pixel(x, y) {
//    polar = xy_to_polar(x, y);
//    if (!polar) {
//        return null;
//    }
//
//    rgb = HSV_to_RGB((polar[1] + Math.PI) / (2 * Math.PI), polar[0], 1);
//    return [255 - rgb[0], 255 - rgb[1], 255 - rgb[2]];
//}

//HSV Picker
function redraw(pos) {
    var ctx = document.getElementById("picker").getContext("2d")

    ctx.putImageData(img, 0, 0)
    ctx.beginPath();
    if (pos) {
        ctx.arc(pos[0], pos[1], 5, 0, 2*Math.PI);
    }
    ctx.stroke();
}

function hsv_get_h(x, y) {
    center_x = canvas_width/4;
    center_y = canvas_height/2;
    rad = Math.min(center_x, center_y);

    dx = x - center_x;
    dy = y - center_y;
    polar = xy_to_polar(dx, dy);

    if (polar[0] > rad * 0.9 || polar[0] < rad * 0.7) {
        return null;
    }
    return (polar[1] + Math.PI) / 2 / Math.PI;
}

var g_hsv_H = 0;
function get_pixel(x, y) {
    if (x < 0 || x > canvas_width || y < 0 || y > canvas_height) {
        return null;
    }
    if (x < canvas_width/2) {
        H = hsv_get_h(x, y);
        if (!H) {
            return null;
        }
        return HSV_to_RGB(H, 1, 1);
    } else {
        S = (x - canvas_width/2) / (canvas_width/2);
        V = y / canvas_height;
        return HSV_to_RGB(g_hsv_H, S, V);
    }
}

function picker_on_click(pos) {
    H = hsv_get_h(pos[0], pos[1]);
    if (H) {
        g_hsv_H = H;
        prepare_bg();
    }
}

function HSV_to_RGB(h, s, v) {
    var i = Math.floor(h * 6);
    var f = h * 6 - i;
    var p = v * (1 - s);
    var q = v * (1 - f * s);
    var t = v * (1 - (1 - f) * s);

    var r = 0,g = 0,b = 0;
    switch(i % 6){
        case 0: r = v; g = t; b = p; break;
        case 1: r = q; g = v; b = p; break;
        case 2: r = p; g = v; b = t; break;
        case 3: r = p; g = q; b = v; break;
        case 4: r = t; g = p; b = v; break;
        case 5: r = v, g = p, b = q; break;
    }

    return [
        Math.floor(r * 255),
        Math.floor(g * 255),
        Math.floor(b * 255)
    ];
}

function mix_color(rgb1, rgb2) {
    return [
        (rgb1[0] + rgb2[0])/2,
        (rgb1[1] + rgb2[1])/2,
        (rgb1[2] + rgb2[2])/2,
    ]
}

function parse_rgb(hex6) {
    return [
            parseInt(hex6.substr(0, 2), 16),
            parseInt(hex6.substr(2, 2), 16),
            parseInt(hex6.substr(4, 2), 16)
        ]
}

function rgb_to_hex(r, g, b) {
    str = (r<<16 | g<< 8 | b).toString(16);
    return ( "000000" + str ).substr( -6 );
}

function xy_to_polar(x, y) {
    let r = Math.sqrt(x*x + y*y);
    ang = Math.atan2(y, x);
    return [r, ang];
}
