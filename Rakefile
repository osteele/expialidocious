require 'rake/clean'
require 'ows_tasks'
require 'openlaszlo_tasks'

SERVER_URL = 'osteele@expialidocio.us:expialidocio.us'
UPLOADS = %w{expialidocious.swf index.html proxy.php favicon.ico javascript about}
ABOUT_HTML = FileList.new 'about/*.html'
ABOUT_MASTER = 'about/about.html'

task :default => :deploy
CLEAN.include 'expialidocious.swf'

task :applet => 'expialidocious.swf'
file 'expialidocious.swf' => FileList.new('src/*.lzx') + FileList.new('src/*.js') do |t|
  source = 'src/expialidocious.lzx' #t.prerequisites.first
  puts "Compiling #{source} => #{t.name}" if verbose
  fname = OpenLaszlo::compile source, :output => t.name
#  mv fname, t.name
end

# Yecch!  But this was the state of my rake-fu in 2006...
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

task :deploy => UPLOADS do
  rsync UPLOADS, SERVER_URL, :delete_excluded => true, :verbose => true
end

desc "Update the server crossdomain.xml to allow connections (only) from this host."
task :crossdomain do |t|
  s = <<EOF
<?xml version="1.0"?>
<!DOCTYPE cross-domain-policy SYSTEM "http://www.macromedia.com/xml/dtds/cross-domain-policy.dtd">
<cross-domain-policy>
  <allow-access-from domain="*"/>
</cross-domain-policy>
EOF
  require 'open-uri'
  ip = open('http://www.whatismyip.com/').read[/Your IP.*([\d.]+)/i, 1]
  raise "Couldn't retrieve IP address" unless ip
  puts "ip = #{ip}"
  s.gsub!(/(domain=")\*(")/, "\\1#{ip}\\2")
  File.open('crossdomain.xml', 'w') do |f| f << s end
  rsync 'crossdomain.xml', SERVER_URL
end
