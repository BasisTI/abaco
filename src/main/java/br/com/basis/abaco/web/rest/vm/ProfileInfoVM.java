package br.com.basis.abaco.web.rest.vm;

public final class ProfileInfoVM {

    private static String[] activeProfiles;

    private static String ribbonEnv;

    public ProfileInfoVM(String[] activeProfiles, String ribbonEnv) {
        this.activeProfiles = activeProfiles;
        this.ribbonEnv = ribbonEnv;
    }

    private static String[] getActiveProfiles() {
        return activeProfiles;
    }

    public String getRibbonEnv() {
        return ribbonEnv;
    }
}
