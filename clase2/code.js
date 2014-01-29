function Player(props)
{
	if(props === undefined) props = {};
	if(props.username !== undefined) this.username = props.username;
}
Player.prototype.username = "Anonymous";
Player.prototype.sayHi = function()
{
	console.log(this.username+": Hola k ase");
}
module.exports = Player;