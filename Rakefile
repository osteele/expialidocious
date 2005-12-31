require 'rake/clean'
require 'ows_tasks'
require 'laszlo'
#require 'laszlo_tasks'

task :default => :upload
CLEAN.include 'cloud.swf'
UPLOADS = %w{cloud.swf index.html proxy.php about}

file 'cloud.swf' => ['cloud.lzx', 'analyzer.js'] do |t|
  puts "Compiling #{t.prerequisites.first} => #{t.name}"
  Laszlo::compile t.prerequisites.first, :output => t.name
end

desc "Synchronize proxy.php between staging and cwd"
task :proxy do
  sync 'proxy.php', File.expand_path('~/Sites/proxy.php')
end

file 'about/proxy.php.txt' => 'proxy.php' do |t|
  cp t.prerequisites.first, t.name
end

task :deploy => UPLOADS + FileList.new('about/*') do
  onserver = "osteele@osteele.com:expialidocio.us" 
  UPLOADS.each do |f|
    puts "Uploading #{f}"
    `rsync -avz -e ssh "#{f}" "#{onserver}"`
  end
end
