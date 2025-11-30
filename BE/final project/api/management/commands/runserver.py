from django.contrib.staticfiles.management.commands.runserver import Command as StaticfilesRunserverCommand

class Command(StaticfilesRunserverCommand):
    default_addr = '0.0.0.0'
    default_port = '7000'

    def handle(self, *args, **options):
        print("----------------------------------------------------------------------")
        print("✅ Custom runserver loaded! Defaulting to 0.0.0.0:7000")
        print("----------------------------------------------------------------------")
        super().handle(*args, **options)
