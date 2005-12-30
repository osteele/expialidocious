require 'laszlo'

file 'cloud.lzx.swf' => ['cloud.lzx', 'analyzer.js'] do |t|
  Laszlo::compile t.prerequisites.first, :output => t.name
end

file 'index.html' => 'cloud.lzx' do |t|
  Laszlo::make_html t.prerequisites.first, :output => t.name
end

task :upload => ['cloud.lzx.swf', 'index.html'] do
  `scp cloud.lzx.swf index.html osteele@osteele.com:osteele.com/projects/cloud-visualizer`
end

task :default => :upload
