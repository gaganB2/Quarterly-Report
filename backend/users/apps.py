# users/apps.py

from django.apps import AppConfig

class UsersConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'users'

    def ready(self):
        """
        Import signals to ensure they are connected when the app is ready.
        """
        import users.models # This connects the signal in models.py