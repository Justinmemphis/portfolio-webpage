---
title: "New Project - Memphis BBQ Review Website"
date: 2026-05-28
excerpt: "Announcement of my new DevOps Project - Memphis BBQ Project"
tags: ["devops", "aws", "terraform"]
coverImage: "/images/blog/new-project.png"
---

I started a new project to test some devops concepts - see my live link here - [live project](https://d10tdoprvg920w.cloudfront.net)

![architecture](/images/blog/architecture.png)

It is a Memphis BBQ Restaurant review website.  I am hosting it on AWS using several new technologies for me - Lambda instead of EC2, DynamoDB instead of RDS/MySQL, and using Cognito for authentication (this is my first project with auth). 

I have the shell of it live - you can create an account and rate five restaurants right now.  I will add more complexity to it as I go along.

![github actions - terraform](/images/blog/actions-tf.png)

For DevOps concepts this is my first multi-environment project - I've got dev and prod environments.  Also the deployment is only through GitHub Actions like some other projects I have built, but in a change, all of the infrastructure is created through terraform code.  I am running actions for plan and apply with a checkov testing step in between to check for security and compliance misconfigurations in the terraform code.

![github actions - python](/images/blog/actions-python.png)

The application code (endpoints) is written in python with a linter (ruff), dependency scan (pip-audit - to check for vulnerable dependencies), and a unit test suite (pytest) with 69 tests to test code functionality.  All of the tests must pass before deployment.

Overall I have enjoyed working on this project.  I have used Claude Code to put it together but it has still taken me over 22 hours of seat time to get this far.  I am looking forward to the next steps on it.
