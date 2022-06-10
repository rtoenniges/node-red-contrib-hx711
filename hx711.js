module.exports = function(RED) {
	function GetWeight(config) {
		RED.nodes.createNode(this,config);
		
		this.hx_data = config.hx_data;
		this.hx_sck = config.hx_sck;
		this.hx_scale = config.hx_scale;
		this.hx_gain = config.hx_gain;
		this.hx_offset = config.hx_offset;
		this.hx_avrg = config.hx_avrg;		

		const hx711 = require("@shroudedcode/hx711");
		const sensor = new hx711(this.hx_sck, this.hx_data, this.hx_gain);

		sensor.setScale(this.hx_scale);	

		this.status({fill:"blue",shape:"dot",text:"ok"});
	
		const node = this;
		this.on('input', function(msg, send, done) {

			if (msg.tare) {
				sensor.tare(node.hx_avrg);	
			} else {

				msg.payload = sensor.getUnits(node.hx_avrg) - node.hx_offset;
		
				if (send) {
					send(msg);
				} else {
					node.send(msg);
				}
			}	
	
			if (done) {
				done();
			}
		});

	}

	RED.nodes.registerType("hx711",GetWeight);
}


