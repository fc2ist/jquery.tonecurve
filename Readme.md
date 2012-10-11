#jQuery Tone Curve
A tone-curve effect plugin for jQuery

##Demo
[http://fc2ist.github.com/jquery.tonecurve/demo.html](http://fc2ist.github.com/jquery.tonecurve/demo.html)

##Usage
~~~~~
var ch, input;
ch = 'rgb';
input = [
  [0, 0],
  [64, 32],
  [192, 160],
  [255, 255]
];
$('img').tonecurve(ch, input);
~~~~~

###Channel option
####Single channel
~~~~~
ch = 'r';
~~~~~

####Multiple channel
~~~~~
ch = 'rb';
~~~~~

####Alpha channel
~~~~~
ch = 'a';
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