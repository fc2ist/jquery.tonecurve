#jQuery Tone Curve
A tone-curve effect plugin for jQuery

##Demo
[http://fc2ist.github.com/jquery.tonecurve/demo.html](http://fc2ist.github.com/jquery.tonecurve/demo.html)

##Usage
~~~~~
var input;

input = {
  rgb: [
    [0, 0],
    [64, 32],
    [192, 160],
    [255, 255]
  ]
};

$('img').tonecurve(input);
~~~~~

###Channel option
####Single channel
~~~~~
input = {
  r: [
    [0, 0],
    [64, 32],
    [192, 160],
    [255, 255]
  ]
};
~~~~~

####Multiple channel
~~~~~
input = {
  rb: [
    [0, 0],
    [64, 32],
    [192, 160],
    [255, 255]
  ]
};
~~~~~

####Alpha channel
~~~~~
input = {
  a: [
    [0, 0],
    [64, 32],
    [192, 160],
    [255, 255]
  ]
};
~~~~~

####Use .acv file (IE9 don't supported)
Load [jDataView](https://github.com/vjeux/jDataView)
~~~~~
<script type="text/javascript" src="path/jdataview.js"></script>
~~~~~

Write path of .acv file to 1st argument

~~~~~
$('img').tonecurve('path/myeffect.acv');
~~~~~

##Support
IE9+ and the others

##License
Copyright &copy; 2012 moi.
Licensed under the [MIT License](http://www.opensource.org/licenses/mit-license.php).

----

##Author
*moi*
Twitter: @moi_fc2
Blog: http://damepo.me