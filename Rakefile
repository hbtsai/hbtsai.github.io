require 'jasmine'
require 'eslintrb'
load 'jasmine/tasks/jasmine.rake'

desc "Run ESLint"
task :eslint do
  puts "Running ESLint..."
  puts Eslintrb.report(Dir.glob("_site/quickstart-guide/js/**/*.js"), :defaults)
end
