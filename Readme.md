#jQuery Tone Curve
A tone-curve effect plugin for jQuery

##Usage
~~~~~
var ch, input;
ch = 'rgb';
input = [
  [64, 32],
  [192, 160]
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