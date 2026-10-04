package com.wispnote.infrastructure;

import com.tngtech.archunit.junit.AnalyzeClasses;
import com.tngtech.archunit.junit.ArchTest;
import com.tngtech.archunit.lang.ArchRule;
import com.tngtech.archunit.library.GeneralCodingRules;
import org.springframework.scheduling.annotation.Async;
import org.springframework.transaction.annotation.Transactional;

import static com.tngtech.archunit.lang.syntax.ArchRuleDefinition.noClasses;
import static com.tngtech.archunit.library.ProxyRules.no_classes_should_directly_call_other_methods_declared_in_the_same_class_that_are_annotated_with;

@AnalyzeClasses(packages = "com.wispnote.backend")
public class ArchitectureTests {

    @ArchTest
    public static final ArchRule checkGenericExceptions = GeneralCodingRules.NO_CLASSES_SHOULD_THROW_GENERIC_EXCEPTIONS;

    @ArchTest
    public static final ArchRule checkAccessToStandardStreams = GeneralCodingRules.NO_CLASSES_SHOULD_ACCESS_STANDARD_STREAMS;

    @ArchTest
    public static final ArchRule checkFieldInjection = GeneralCodingRules.NO_CLASSES_SHOULD_USE_FIELD_INJECTION;

    @ArchTest
    public static final ArchRule checkAsyncCallInSameClass = no_classes_should_directly_call_other_methods_declared_in_the_same_class_that_are_annotated_with(Async.class);

    @ArchTest
    public static final ArchRule checkTransactionalCallInSameClass = no_classes_should_directly_call_other_methods_declared_in_the_same_class_that_are_annotated_with(Transactional.class);

    @ArchTest
    public static final ArchRule checkApplicationShouldNotDependOnAdapter = noClasses().that().resideInAPackage("..application..").should().dependOnClassesThat().resideInAPackage("..adapter..");

    @ArchTest
    public static final ArchRule checkApplicationShouldNotDependOnInfrastructure = noClasses().that().resideInAPackage("..application..").should().dependOnClassesThat().resideInAPackage("..infrastructure..");

    @ArchTest
    public static final ArchRule checkAdapterShouldNotDependOnInfrastructure = noClasses().that().resideInAPackage("..adapter..").should().dependOnClassesThat().resideInAPackage("..infrastructure..");

    @ArchTest
    public static final ArchRule checkServiceShouldNotDependOnFacade = noClasses().that().haveSimpleNameContaining("Service").should().dependOnClassesThat().haveSimpleNameContaining("Facade");

    @ArchTest
    public static final ArchRule checkServiceShouldNotDependOnRepository = noClasses().that().haveSimpleNameContaining("Service").should().dependOnClassesThat().haveSimpleNameContaining("Repository");

    @ArchTest
    public static final ArchRule checkAdapterShouldNotDependOnService = noClasses().that().haveSimpleNameContaining("Adapter").should().dependOnClassesThat().resideInAPackage("..application..service..");
}
