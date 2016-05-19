Starting the servers
===================
* From within a terminal navigate to the project location.
* Start the first server with the start script in the server1 directory.
* From an internet browser, go to http://localhost:3030, click on add data, select files, output.ttl,
   upload all.
* The server status button (top right corner) in the browser should then be green.
* In another terminal window, navigate to the project directory and
   start the second server with the start script in the server2 directory.
* From an internet browser, go to http://localhost:3031, click on add data, select files, outputFood.ttl,
   upload all.
* The server status button (top right corner) in the browser should then be green.

Testing the application
=======================
When the servers are started up, the application can be tested by opening page.html in an internet browser.
It is possible that build-in securities of the browser needs to be disabled to avoid the browser blocking the application due to
 cross-site scripting attacks detection.
If the application is published on a apache like "real remote server" this problem is not present anymore.

Mapping
=======================
The mapping can be executed with the doMapping.sh script. It will generate an output.tll file
and relies on mapping.tll.

-- Dowoyali Team --
