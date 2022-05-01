# Project-Sejin

## Overview
index.js is the entry point on starting up the bot and listening to commands. 
All commands are hosted in separate files under the /command folder. 

## Tweaking configurations
You can tweak the configurations by modifying values in config.json

## Commands

Commands all start with `/` and will give you tool-tips if you start typing in Discord.

| Command                                                                                                                    |                             Description                             |
|----------------------------------------------------------------------------------------------------------------------------|-------------------------------------------------------------------|
| [`/addcc <class code> <channel> <role> <title> <image url> <type> [number of assignments]`](#-addcc)                       | Add a class to the database.                                        |
| [`/addhwchannel <class code> <channel>`](#-addhwchannel)                                                                   | Add a homework channel to a class.                                  |
| [`/addhwcheckerrole <role>`](#-addhwcheckerrole)                                                                           | Add a role as a homework checker                                    |
| [`/findcc <role>`](#-findcc)                                                                                                     | Find a class code using a role.                                     |
| [`/log <class code> [description]`](#-log)                                                                                 | Log a class in the message channel.                                 |
| [`/loghw <class code> <start date> <start time> <end date> <end time> [description] [homework description]`](#-loghw)      | Log a club in the message channel.                                  |
| [`/loghwclass <class code> <start date> <start time> <end date> <end time> [description]`](#-loghwclass) | Log a class with homework as a requirement for logbook in the message channel. |
| [`/removehwchannel <channel>`](#-removehwchannel)                                                                          | Remove a homework channel                                           |
| [`/removehwcheckerrole <role>`](#-removehwcheckerrole)                                                                     | Remove a role for being a homework checker                          |
| [`/setmessagechannel regular <channel>`](#-setmessagechannel-regular)                                                      | Set a message channel in the current server for logbook.            |
| [`/setmessagechannel cross_server <channel id> <server id>`](#-setmessagechannel-crossserver)                              | Set a message channel in another server for logbook.                |


#### <font size=3>⚡ /addcc</font>

**Example:** `/addcc 130613 #hwchannel  @Go Billy 🧢 Watch Club Go Billy Self-Study Club http://url club 5`

- **Options:** `<class_code>` _(string)_ Required, `<channel>` *(@channel)* Required, `<role>` *(@role)* Required, `<title>` _(string)_ Required, `<image_url>`_(string)_ Required, `<type>` _(string)_ Required, `<number_assignments>` _(number)_ Optional, required for registering clubs
- **Permissions:** MANAGE_CHANNELS

Adds a class/club to the database.

#### <font size=3>⚡ /addhwchannel</font>

**Example:** `/addhwchannel 130613 #hwchannel`
- **Options:** `<class_code>` _(string)_ Required, `<channel>` *(@channel)* Required
- **Permissions:** MANAGE_CHANNELS

Adds a homework channel to a class/club.

#### <font size=3>⚡ /addhwcheckerrole</font>

**Example:** `/addhwcheckerrole @Helper`
- **Options:** `<role>` *(@role)* Required
- **Permissions:** MANAGE_CHANNELS

Adds a role as a homework checker

#### <font size=3>⚡ /findcc</font>

**Example:** `/findcc @Go Billy 🧢 Watch Club`
- **Options:** `<role>` *(@role)* Required
- **Permissions:** MANAGE_CHANNELS

Finds a class code using a role.

#### <font size=3>⚡ /log</font>

**Example:** `/log 130613 First class`
- **Options:** `<class_code>` _(string)_ Required, `<description>` _(string)_ Optional
- **Permissions:** None

Logs a class in the message channel. 

#### <font size=3>⚡ /loghw</font>

**Example:** `/loghw 130613 2022/06/10 00:00 2022/06/13 06:13 Second logbook of the month Assignment #"number"`
- **Options:** `<class_code>` _(string)_ Required, `<start_date>` _(string)_ Required, `<start_time>` _(string)_ Required, `<end_date>` _(string)_ Required, `<end_time>` _(string)_ Required, `<description>` _(string)_ Optional, `<hw_description>` _(string)_ Optional
- **Permissions:** None

Logs a club in the message channel. The homework description text is the text added to separate the assignments based by the assignment number. The default text is Assignment _(number)_. To modify this text, use the homework description option. To add the assignment number in the message, you can add "number". 

When entering the `<start_date>`, `<start_time>`, `<end_date>`, and `<end_time>` the format should be in CT (America/Chicago) timezone and in YYYY-MM-DD HH:MM format. It may not be a date time that has already passed. With the 2-digit month, 2-digit day, and time in 24-hour format.
   - ✅ 2022-06-13 22:00
   - ❌ 2022-6-13 10:00 PM
   - ❌ 6-13-2022 10:00

#### <font size=3>⚡ /loghwclass</font>

**Example:** `/loghwclass 130613 2022/06/10 00:00 2022/06/13 06:13 Second class`
- **Options:** `<class_code>` _(string)_ Required, `<start_date>` _(string)_ Required, `<start_time>` _(string)_ Required, `<end_date>` _(string)_ Required, `<end_time>` _(string)_ Required, `<description>` _(string)_ Optional
- **Permissions:** None

Log a class with homework as a requirement for logbook in the message channel.

#### <font size=3>⚡ /removehwchannel</font>

**Example:** `/removehwchannel #hwchannel`
- **Options:** `<channel>` *(@channel)* Required
- **Permissions:** MANAGE_CHANNELS

Removes a homework channel.

#### <font size=3>⚡ /removehwcheckerrole</font>

**Example:** `/removehwcheckerrole @Helper`
- **Options:** `<role>` *(@role)* Required
- **Permissions:** MANAGE_CHANNELS

Removes a role for being a homework checker

#### <font size=3>⚡ /setmessagechannel regular</font>

**Example:** `/setmessagechannel regular #📔logbook-logging`
- **Options:** `<channel>` *(@channel)* Required
- **Permissions:** MANAGE_CHANNELS

Sets a message channel in the current server for logbook.

#### <font size=3>⚡ /setmessagechannel crossserver</font>

**Example:** `/setmessagechannel cross_server 888827410261356575 888439837256994823`
- **Options:** `<channel_id>` *(string)* Required, `<server_id>` *(string)* Required
- **Permissions:** MANAGE_CHANNELS

Sets a message channel in another server for logbook.
