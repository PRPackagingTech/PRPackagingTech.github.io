function cmykToRgb(c,m,y,k)
{
	var cmyk_c = Number(c), cmyk_m = Number(m), cmyk_y = Number(y), cmyk_k = Number(k);

	if(cmyk_c > 0){
		cmyk_c = cmyk_c;
	}
	else if(cmyk_m > 0){
		cmyk_m = cmyk_m;
	}
	else if(cmyk_y > 0){
		cmyk_y = cmyk_y;
	}
	else if(cmyk_k > 0){
		cmyk_k = cmyk_k;
	}

	rgb_r = 1 - Math.min( 1, cmyk_c * ( 1 - cmyk_k ) + cmyk_k );
	rgb_g = 1 - Math.min( 1, cmyk_m * ( 1 - cmyk_k ) + cmyk_k );
	rgb_b = 1 - Math.min( 1, cmyk_y * ( 1 - cmyk_k ) + cmyk_k );

	rgb_r = Math.round( rgb_r * 255 );
	rgb_g = Math.round( rgb_g * 255 );
	rgb_b = Math.round( rgb_b * 255 );

	return (rgb_r + "," + rgb_g + "," + rgb_b);
}

function hexToRgb(val)
{
	val = val.replace("#", "");
	val = val.trim();

	return (parseInt(val.substring(0,2),16) + "," + parseInt(val.substring(2,4),16) + "," + parseInt(val.substring(4,6),16));
}

function rgbToHex(R, G, B)
{
	return toHex(R) + toHex(G) + toHex(B);
}

function toHex(n)
{
	n = parseInt(n, 10);
	if (isNaN(n))
  {
    return "00";
  }

	n = Math.max(0, Math.min(n, 255));

	return "0123456789ABCDEF".charAt((n - n % 16) / 16) + "0123456789ABCDEF".charAt(n % 16);
}

function cmykToHex(c, m, y, k)
{
  var rgb = cmykToRgb(c, m, y, k);

	rgb = rgb.split(",");

	return "#" + rgbToHex(rgb[0],rgb[1],rgb[2]);
}
