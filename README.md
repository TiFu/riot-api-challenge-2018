# Trophy Hunter <img src="/examples/logo.png" width="60" height="60">
[![Build Status](https://travis-ci.com/TiFu/riot-api-challenge-2018.svg?token=3VvqnLpe2ibJHC5uy4EV&branch=master)](https://travis-ci.com/TiFu/riot-api-challenge-2018)

![Example Trophy Wall](./examples/wall_semi_cleared.png)

## What is "Trophy Hunter"?
Trophy Hunter creates your own personalized trophy wall based on the challenges that you complete. It is designed to be enjoyable for all kind of League players, and aims to provide even casual players with something that is nice to look at and that they can be proud of.
The challenges are meant to be fun, help players improve, push them to think outside the box and emphasize teamplay. The more challenges you complete, the more awesome your wall will become!

This video aims to give a brief overview of Trophy Hunter.

https://www.youtube.com/watch?v=oc2CF3OyAFA

[![Demo Video](https://img.youtube.com/vi/oc2CF3OyAFA/0.jpg)](https://www.youtube.com/watch?v=oc2CF3OyAFA)

## How do I get to use it?

[Download and launch the installer here.](https://github.com/TiFu/riot-api-challenge-2018/releases)

Log into your League Client to automatically log into "Trophy Hunter" as well. Now you are ready to go. Just play any matchmade game and it will count towards your challenges. Have fun!

## What technical challenges did you face?

![Backend Structure](https://raw.githubusercontent.com/TiFu/riot-api-challenge-2018/master/examples/overview.png)

One of the most challenging tasks in this project was getting the communication between 
the different services correct. In order to make this task (and especially deploys) easier,
we used `docker-compose` to orchestrate our four backend services. As you can see in the picture
above, we have one server which handles all user requests and one which calculates
the game results (i.e. unlocked achievements). PostgreSQL is used as our data store and redis to communicate
between the "frontend" server and the processing server. To see how easy our deploys are,
check out our [technical README](./scripts/README.md).

The communication between our electron client and the "frontend" server uses `Socket.io` and a package
called `typed-socket.io` which allows us to completely statically type-check the communication endpoints
in our client and our frontend server and therefore decreases the likelihood of bugs significantly.


## Is that custom art?
Aside from the champion/skin art used in the tree (who would have guessed) and the known role icons, almost everything was drawn by us. The Trophy Hunter icon, the backgrounds, the picture borders, the shelves, the background and the trophies. The lane trophies themselves were obviously inspired from themes from our beloved game.

<img src="/examples/Midlane_Trophy_1.png" width="400" height="283"> <img src="/examples/Midlane_Trophy_4.png" width="400" height="283">

## Who participated?
TiFu (euw) and Cookie Knight (euw). If there are any bugs... uhm... it's a feature.

## What does the future hold?
More challenges, more trophies. We want to create an option where you can search for an see the trophy walls of other players. We have the backend tools needed to create a mode, where you can create challenges with your own criteria and share it to challenge your friends.


## FAQ

### I cannot find my friends to invite.
In this case, let them use the app and connect to the client once. This should fix it.

### I cannot clear group challenges.
Have you tried tackeling them in a team of 5 people from the same group? We added this feature so that randoms won't get trolled.
