require 'rake/clean'
require 'ows_tasks'
require 'laszlo'
#require 'laszlo_tasks'

task :default => :upload
CLEAN.include '*.lzx.swf'
CLEAN.include 'index.html'
UPLOADS = %w{cloud.swf index.html proxy.php}

file 'cloud.swf' => ['cloud.lzx', 'analyzer.js'] do |t|
  puts "Compiling #{t.prerequisites.first} => #{t.name}"
  Laszlo::compile t.prerequisites.first, :output => t.name
end

task :proxy do
  sync 'proxy.php', File.expand_path('~/Sites/proxy.php')
end

task :deploy do
  onserver = "osteele@osteele.com:expialidocio.us" 
  UPLOADS.each do |f|
    puts "Uploading #{f}"
    `rsync -avz -e ssh "#{f}" "#{onserver}"`
  end
end
