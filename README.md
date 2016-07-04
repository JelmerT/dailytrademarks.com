Dailytrademarks.com
===================

Project Status: UNFINISHED

This repository holds the source files of a web application that scrapes the daily images of the [Trademark Daily Applications](http://www.uspto.gov/learning-and-resources/electronic-data-products/trademark-data-products#heading-2) of the [USPTO](http://www.uspto.gov/).

The goal is to have a daily visual summary of all new trademark applications. This website would enable you to discover new interesting products and brands or discover new possible products that aren't released yet.

The trademark applications and all meta-data get unzipped and parsed into a mongodb database by a python script.

The accompanying node.js web applications displays all images in an infinite scrolling grid. When the image is clicked the database is queried and all meta data is served back to the user.

#####Author
Jelmer Tiete (c) 2016, <jelmer@tiete.be>   

#####License
**This code is released under the [Creative Commons Share-alike 4.0 International](http://creativecommons.org/licenses/by-sa/4.0/) license.**

![CC-by-sa](http://i.creativecommons.org/l/by-sa/4.0/88x31.png)

[![Analytics](https://ga-beacon.appspot.com/UA-3496907-10/JelmerT/dailytrademarks.com?pixel)](https://github.com/igrigorik/ga-beacon)
