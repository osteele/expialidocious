require 'rake/clean'
require 'ows_tasks'
require 'openlaszlo_tasks'

SERVER_URL = 'osteele@osteele.com:expialidocio.us'
UPLOADS = %w{expialidocious.swf index.html proxy.php favicon.ico javascript about}
PUBLIC_SOURCES=%w{expialidocious.png analyzer.js expialidocious.lzx histogram.lzx colors.js login.lzx thumb.lzx}
ABOUT_HTML = FileList.new 'about/*.html'
ABOUT_MASTER = 'about/about.html'

task :default => :deploy
CLEAN.include 'cloud.swf'

file 'expialidocious.swf' => FileList.new('*.lzx') + FileList.new('*.js')

(ABOUT_HTML - [ABOUT_MASTER]).each do |f|
  file f => ABOUT_MASTER do |t|
    source = File.open(ABOUT_MASTER).read
    header = source =~ /^.*<!--header:end-->/m && $&
    footer = source =~ /<!--footer:begin-->.*$/m && $&
    title = File.basename(t.name, '.html').split(/-/).map{|w|w.capitalize}.join(' ')
    title += '?' if title =~ /^Why/
    text = File.open(t.name).read
    title = $1 if text =~ /<title>(.*)<\/title>/
    header.gsub!('>About<', ">#{title}<")
    text.gsub!(/^.*<!--header:end-->/m, header)
    text.gsub!(/<!--footer:begin-->.*$/m, footer)
    puts 'Updating ' + t.name if verbose
    File.open(t.name, 'w') {|f| f << text}
  end
end

desc "Synchronize proxy.php between staging and cwd"
task :proxy do
  sync 'proxy.php', File.expand_path('~/Sites/proxy.php')
end

file 'about/proxy.php.txt' => 'proxy.php' do |t|
  cp t.prerequisites.first, t.name
end

task :deploy_sources do
  sh "rsync -avz -e ssh #{PUBLIC_SOURCES.join(' ')} #{SERVER_URL}/src"
end

task :deploy_about => FileList.new('about/*') do |t|
  sh "rsync -avz -e ssh --exclude=.svn about #{SERVER_URL}"
end

task :deploy => UPLOADS + [:deploy_sources, :deploy_about] do
  SERVER_URL = "osteele@osteele.com:expialidocio.us" 
  sh "rsync -avz -e ssh --exclude=.svn #{UPLOADS.join(' ')} #{SERVER_URL}"
end

task :crossdomain do |t|
  s = <<EOF
<?xml version="1.0"?>
<!DOCTYPE cross-domain-policy SYSTEM "http://www.macromedia.com/xml/dtds/cross-domain-policy.dtd">
<cross-domain-policy>
  <allow-access-from domain="*"/>
</cross-domain-policy>
EOF
  require 'open-uri'
  ip = open('http://www.whatismyip.com/').read =~ /Your IP\s*-\s*([\d.]*)/ && $1
  puts "ip = #{ip}"
  s.gsub!(/(domain=")\*(")/, "\\1#{ip}\\2")
  #puts s
  File.open('crossdomain.xml', 'w') do |f| f << s end
  sh "rsync -avz -e ssh crossdomain.xml osteele@osteele.com:expialidociou.us"
end
