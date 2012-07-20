
function getAndWriteData(comp, layer)
{
	// how many masks?
	var mnum = layer.Masks.numProperties;
	
	// step through the masks and generate a file with points for each one
	for (var mc = 0; mc < mnum; mc++)
	{
		// total number of frames in the layer
		var numf = (layer.outPoint - layer.inPoint) / comp.frameDuration;
		// first frame in the layer
		var startf = layer.inPoint / comp.frameDuration;
		// the display frame number that will incremented
		var countf = startf;
		// open the file
		var file = new File("outlines_" + mc + ".plist");
		if (file.open("w"))
		{
			file.writeln('<?xml version="1.0" encoding="UTF-8"?>');
			file.writeln('<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">');
			file.writeln('<!-- layer with length ' + numf + ' starting at frame ' + startf + ' -->');
			file.writeln('<plist version="1.0">');
			file.writeln('<array>');
		    for (var t = layer.inPoint; t < layer.outPoint; t += comp.frameDuration)
		    {
				// get the vertices as an array (mask numbering starts at 1, that's why I'm adding 1 to mc)
				var myshape = layer.Masks.property(mc + 1).property(1).valueAtTime(t, false);
				var vertices = myshape.vertices;
				// write the vertices to a line of the file
				var writeme = '			<array>\n';
				var numv = vertices.length;
				for (var v = 0; v < numv; v++)
				{
					writeme += "				<string>{" + vertices[v][0] + ", " + vertices[v][1] + "}</string>\n";
				}
				writeme += '			</array>';
			
				file.writeln('	<dict>');
				file.writeln('		<key>frame</key>');
				file.writeln('		<real>' + countf + '</real>');
				file.writeln('		<key>shapes</key>');
				file.writeln('		<array>');
				file.writeln(writeme);
				file.writeln('		</array>');
				file.writeln('	</dict>');			
				countf++;
		    }
			file.writeln('</array>');
			file.writeln('</plist>');
			file.close();
		}
	}
}

var comp = app.project.activeItem;
var layer = comp.selectedLayers[0];

getAndWriteData(comp, layer);
