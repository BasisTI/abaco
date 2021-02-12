package br.com.basis.abaco.cucumber.stepdefs;

import br.com.basis.abaco.AbacoApp;

import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.web.WebAppConfiguration;
import org.springframework.test.web.servlet.ResultActions;

import org.springframework.boot.test.context.SpringBootTest;

@WebAppConfiguration
@SpringBootTest
@ContextConfiguration(classes = AbacoApp.class)
public abstract class StepDefs {

    protected ResultActions actions;

}
