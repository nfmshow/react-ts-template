export const config = {
	type: 0,
	scale: 0.8,
	color: '#A52A2A',
	backgroundColor: '#A52A2A',
	backgroundOpacity: 0.1
};

export const loaders = [
	{
		css: function(params) {
			const {
				scale,
				color
			} = {
				scale: 1,
				color: '#fff',
				...(params || {})
			};
			return `.lds-dual-ring {
				display: inline-block;
				width: ${scale*1*80}px;
				height: ${scale*1*80}px;
			}
			.lds-dual-ring:after {
				content: " ";
				display: block;
				width: ${scale*1*64}px;
				height: ${scale*1*64}px;
				margin: ${scale*1*8}px;
				border-radius: 50%;
				border: ${scale*1*6}px solid ${color};
				border-color: ${color} transparent ${color} transparent;
				animation: lds-dual-ring 1.2s linear infinite;
			}
			@keyframes lds-dual-ring {
				0% {
					transform: rotate(0deg);
				}
				100% {
					transform: rotate(360deg);
				}
			}`;
		},
		html: function() {
			return `<div class="lds-dual-ring"></div>`;
		}
	}
]