# Project Context

## Overview
Electronic vote is thinked to allows users for votations in a lapse time, admins can create new votations, upload candidates photos and lists, and download results and advisors can see how the votations it's going

## Stack

- Framework: Nuxt 4
- Database: Postgres 17
- Nuxt UI: 4.5.1
- ORM: Drizzle
- Autentication: auth-nuxt-utils

## Architecture

This project has a Nuxt layer architecture, where the main layers are:
* auth: where users can login, register, and change passwords
* home: where users can vote if is any available votation, else shows info
* profile: users can see an if they have privilige can update profile info.
* dashboard: available for admins and advisors, shows dashboard information about votations.
* management: where admins can create new votations, enable users, and update related information.


## Conventions
* **Clases:** use `UpperCase`.
* **methods and functions:** use `lowerCase`


## Do Not Touch

Never modify
* `.env`
* `docker-compose.yaml`
* `nuxt.config.ts`
