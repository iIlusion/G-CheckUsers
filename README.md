# WARNING

**You need to run this in a new account with te option to change name!!**

# G-CheckUsers
## _Check available OG Users_

G-CheckUsers is a [G-Earth](https://github.com/sirjonasxx/G-Earth) extension to check a list of users available in habbo.

## Features

- 2~ checks per minute
- Storage all free names in free.txt

## Usage

1° Clone this [repo](https://github.com/iIlusion/G-CheckUsers)
2° Install the dependencies

```sh
npm i
```
3° with g-earth started and habbo connected run `npm start`
4° Click in start button on G-Earth extension tab.
5° Wait run all checks.

## Add users do check list

1° Go to `add.txt`                                                           2° add users (1 per line)

**Example**
```sh
User1
User2
User3
User4
User5
```
> **Note¹**: when adding a user to the user list, it checks if the user already exists, so you can't add 2x the same user


> **Note²**: G-CheckUsers check all users list and return all free, but doesn't save checked status on finish... feel free to pr this repo to help <3
